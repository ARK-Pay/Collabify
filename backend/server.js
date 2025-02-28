import express from "express";
import http from "http";
import { Server } from "socket.io";
import mediasoup from "mediasoup";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const mediaCodecs = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: { "x-google-start-bitrate": 1000 },
  },
];

let worker, router;
const transports = {};
const producers = {};
const consumers = {};

async function startMediasoup() {
  worker = await mediasoup.createWorker();
  router = await worker.createRouter({ mediaCodecs });
  console.log("✅ Mediasoup Router Created!");
}

startMediasoup();

io.on("connection", (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  socket.on("get-rtp-capabilities", (callback) => {
    callback(router.rtpCapabilities);
  });

  socket.on("create-transport", async (_, callback) => {
    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: "0.0.0.0", announcedIp: "192.168.1.81" }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    transports[socket.id] = transport;
    callback({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  });

  socket.on("create-transport", async (data, callback) => {
    if (typeof callback !== "function") {
      console.error("❌ Missing or invalid callback function for create-transport");
      return;
    }
  
    try {
      const transport = await router.createWebRtcTransport({
        listenIps: [{ ip: "0.0.0.0", announcedIp: "192.168.1.81" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });
  
      transports[socket.id] = transport;
      callback({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      });
    } catch (error) {
      console.error("❌ Error creating transport:", error);
      callback({ error: "Failed to create transport" });
    }
  });

  socket.on("produce", async ({ kind, rtpParameters }, callback) => {
    if (!rtpParameters.codecs) return callback({ error: "Missing RTP codecs" });

    const transport = transports[socket.id];
    const producer = await transport.produce({ kind, rtpParameters });

    producers[socket.id] = producer;
    socket.broadcast.emit("new-producer", { id: producer.id });
    callback({ id: producer.id });
  });

  socket.on("consume", async ({ producerId, rtpCapabilities }, callback) => {
    if (!router.canConsume({ producerId, rtpCapabilities })) {
      return callback({ error: "Cannot consume" });
    }

    const transport = transports[socket.id];
    const consumer = await transport.consume({ producerId, rtpCapabilities, paused: false });

    consumers[socket.id] = consumer;
    callback({
      id: consumer.id,
      producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
    if (producers[socket.id]) producers[socket.id].close();
    if (consumers[socket.id]) consumers[socket.id].close();
    delete producers[socket.id];
    delete consumers[socket.id];
    delete transports[socket.id];
  });
});

server.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});

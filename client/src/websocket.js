import { io } from "socket.io-client";

// Change this to your actual backend IP
const SERVER_URL = "ws://192.168.1.81"; // Use "http://localhost:5000" if testing locally

const socket = io(SERVER_URL, {
    transports: ["websocket", "polling"]
});

socket.on("connect", () => {
    console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
});

export default socket;

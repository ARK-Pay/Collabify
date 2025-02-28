import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./VideoConference.css";

const socket = io("http://127.0.0.1:3001", {
  transports: ["websocket"],
  withCredentials: true,
});

const VideoConference = ({ roomId }) => {
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  
  const myVideo = useRef();
  const screenVideo = useRef();

  // Define refs to avoid 'undefined' errors
  const analyser = useRef(null);
  const dataArray = useRef(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (myVideo.current) myVideo.current.srcObject = mediaStream;

        socket.emit("create-transport", {}, (data) => {
          if (!data || data.error) {
            console.error("Transport creation failed:", data.error);
            return;
          }

          const { id } = data;
          
          socket.emit("produce", { transportId: id, kind: "video", rtpParameters: {} });
          socket.emit("produce", { transportId: id, kind: "audio", rtpParameters: {} });
        });

        socket.emit("join-room", roomId, socket.id);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    startMedia();

    socket.on("new-producer", ({ producerId }) => {
      socket.emit("consume", { producerId, rtpCapabilities: {} }, (consumer) => {
        if (!consumer) return;
        
        const newStream = new MediaStream();
        newStream.addTrack(consumer.track);
        setRemoteStreams((prev) => [...prev, newStream]);
      });
    });

    socket.on("user-disconnected", (userId) => {
      setRemoteStreams((prev) => prev.filter((stream) => stream.userId !== userId));
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.disconnect();
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
    };
    
  }, [roomId]);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    analyser.current = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser.current);
    analyser.current.fftSize = 256;

    const bufferLength = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength);

    const detectSpeaking = () => {
      if (!analyser.current || !dataArray.current) return;

      analyser.current.getByteFrequencyData(dataArray.current);
      const volume = dataArray.current.reduce((sum, val) => sum + val, 0) / bufferLength;

      if (volume > 10 && micOn) {
        setActiveSpeaker(socket.id);
      } else {
        setActiveSpeaker(null);
      }

      requestAnimationFrame(detectSpeaking);
    };

    detectSpeaking();

    return () => {
      audioContext.close();
    };
  }, [stream, micOn]);


  useEffect(() => {
    socket.on("user-joined", (user) => {
      setParticipants((prev) => [...prev, { id: user.id, micOn: true, cameraOn: true }]);
    });
  
    socket.on("user-left", (userId) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    });
  
    socket.on("mic-toggle", ({ userId, micOn }) => {
      updateParticipant(userId, { micOn });
    });
  
    socket.on("camera-toggle", ({ userId, cameraOn }) => {
      updateParticipant(userId, { cameraOn });
    });
  
    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("mic-toggle");
      socket.off("camera-toggle");
    };
  }, []);

  useEffect(() => {
  const startMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (myVideo.current) myVideo.current.srcObject = mediaStream;

      // Add yourself to participants list
      setParticipants((prev) => [
        ...prev,
        { id: socket.id, name: "You", micOn: true, cameraOn: true },
      ]);

      socket.emit("join-room", roomId, socket.id);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  startMedia();
}, [roomId]);

useEffect(() => {
  if (!stream) return;

  // Add self to participants list
  setParticipants((prev) => [
    ...prev.filter((p) => p.id !== socket.id), // Remove duplicate entry if re-render
    { id: socket.id, name: "You", micOn: micOn, cameraOn: cameraOn },
  ]);
}, [stream, micOn, cameraOn]);

  

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
  
      // Update yourself in participants list
      setParticipants((prev) =>
        prev.map((p) => (p.id === socket.id ? { ...p, micOn: audioTrack.enabled } : p))
      );
  
      socket.emit("mic-toggle", { userId: socket.id, micOn: audioTrack.enabled });
    }
  };
  
  
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
  
      // Update yourself in participants list
      setParticipants((prev) =>
        prev.map((p) => (p.id === socket.id ? { ...p, cameraOn: videoTrack.enabled } : p))
      );
  
      socket.emit("camera-toggle", { userId: socket.id, cameraOn: videoTrack.enabled });
    }
  };
  
  
  

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
        console.log("Screen Stream:", screenStream);
        const screenTrack = screenStream.getVideoTracks()[0];
        console.log("Screen Track:", screenTrack);
  
        setScreenStream(screenStream);
  
        setTimeout(() => {
          console.log("Screen Video Element (Before Setting Stream):", screenVideo.current);
          
          if (screenVideo.current) {
            screenVideo.current.srcObject = screenStream;
            screenVideo.current.onloadedmetadata = () => {
              screenVideo.current.play().catch(error => console.error("AutoPlay Error:", error));
            };
            console.log("Screen Video Element (After Setting Stream):", screenVideo.current);
          }
        }, 500); // Delay to allow ref assignment
  
        screenTrack.onended = stopScreenShare;
        setScreenSharing(true);
      } catch (error) {
        console.error("Screen sharing error:", error);
      }
    } else {
      stopScreenShare();
    }
  };
  

const stopScreenShare = () => {
  if (screenStream) {
    screenStream.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
  }
  setScreenSharing(false);
};

const [participants, setParticipants] = useState([]);

const [showParticipants, setShowParticipants] = useState(false);

const toggleParticipants = () => {
  setShowParticipants((prev) => !prev);
};

const updateParticipant = (userId, changes) => {
  setParticipants((prev) =>
    prev.map((p) => (p.id === userId ? { ...p, ...changes } : p))
  );
};


  const handleEndCall = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
    socket.emit("leave-room", roomId);
    window.location.href = "/video-call";
  };

  return (
    <div className="video-conference">
      <div className={`participants-sidebar ${showParticipants ? "open" : ""}`}>
  <h3>Participants</h3>
  <ul>
    {participants.map((p) => (
      <li key={p.id} className="participant-item">
        {p.name || `User ${p.id.slice(-4)}`}  
        {p.micOn ? "🎤" : "🔇"}  
        {p.cameraOn ? "📷" : "📷❌"}
      </li>
    ))}
  </ul>
</div>

      <div className={`video-grid ${screenSharing ? "screen-active" : ""}`}>
        <video ref={myVideo} autoPlay muted className={`video-box ${activeSpeaker === socket.id ? "active-speaker" : ""}`} />
        {remoteStreams.map((stream, index) => (
          <video key={index} autoPlay className={`video-box ${activeSpeaker === stream.userId ? "active-speaker" : ""}`} ref={(ref) => ref && (ref.srcObject = stream)} />
        ))}
        {screenSharing && (
          <div className="screen-share-container">
            <video ref={screenVideo} autoPlay className="screen-share-video" />
          </div>
        )}
      </div>

      <div className="call-controls">
        <button className={`control-btn mic-btn ${micOn ? "" : "off"}`} onClick={toggleMic}>
          {micOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button className={`control-btn camera-btn ${cameraOn ? "" : "off"}`} onClick={toggleCamera}>
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button className={`control-btn share-btn ${screenSharing ? "active" : ""}`} onClick={toggleScreenShare}>
          {screenSharing ? "Stop Sharing" : "Share Screen"}
        </button>
        <button className="control-btn end-call-btn" onClick={handleEndCall}>
          End Call
        </button>
        <button className="control-btn" onClick={toggleParticipants}>
  {showParticipants ? "Close Participants" : "Show Participants"}
</button>

      </div>
    </div>
  );
};

export default VideoConference;

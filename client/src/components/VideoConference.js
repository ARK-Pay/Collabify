import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./VideoConference.css";
import axios from "axios";

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
  const [meetingSummary, setMeetingSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [meetingTranscript, setMeetingTranscript] = useState("");

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
  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    console.log("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }
    setMeetingTranscript(transcript);
  };

  recognition.start();

  return () => recognition.stop(); // Stop recognition when component unmounts
}, []);



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

  
  const fetchTranscript = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transcribe");
      const data = await response.json();
      if (data.transcript) {
        setMeetingTranscript(data.transcript); // Store the transcript
      }
    } catch (error) {
      console.error("Error fetching transcript:", error);
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

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("SpeechRecognition not supported in this browser.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }
    console.log("Transcript:", transcript);
  };

  recognition.start();
}

  

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


const startTranscription = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();

  let audioChunks = [];
  mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("http://localhost:5000/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Transcript:", data.transcript);
  };

  setTimeout(() => mediaRecorder.stop(), 30000); // Stop after 30 sec (adjust as needed)
};

const handleSummarizeMeeting = async () => {
  if (!meetingTranscript || meetingTranscript.trim() === "") {
    alert("❌ No transcript found! Please speak during the call.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: meetingTranscript }),
    });

    const data = await response.json();
    if (data.summary) {
      setMeetingSummary(data.summary);
    } else {
      alert("❌ Failed to generate summary. Try again.");
    }
  } catch (error) {
    console.error("Error summarizing meeting:", error);
    alert("❌ Error connecting to AI summarizer.");
  }
};




const downloadSummary = () => {
  if (!meetingSummary) {
    alert("No summary available to download!");
    return;
  }

  const element = document.createElement("a");
  const file = new Blob([meetingSummary], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = "meeting_summary.txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
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

  

  <button className="control-btn show-participants" onClick={toggleParticipants}>
  {showParticipants ? "Close Participants" : "Show Participants"}
</button>

<button className="control-btn ai-summarizer" onClick={handleSummarizeMeeting}>
  AI Summarizer
</button>



</div>

  </div>
);
}

export default VideoConference;

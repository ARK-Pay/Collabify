import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./VideoCallJoin.css";

const VideoCallJoin = () => {
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState(null);
  const navigate = useNavigate();

  // Generate a new room ID and store it
  const handleGenerateRoom = () => {
    const newRoomId = uuidv4();
    setGeneratedRoomId(newRoomId);
    setRoomId(newRoomId);
  };

  // Copy room ID to clipboard
  const copyToClipboard = () => {
    const roomLink = `${window.location.origin}/video-call/${generatedRoomId}`;
    navigator.clipboard.writeText(roomLink);
    alert("Room link copied! Share it with others.");
  };

  // Join Video Call
  const joinRoom = () => {
    if (roomId.trim() !== "") {
      navigate(`/video-call/${roomId}`);
    } else {
      alert("Please enter or generate a Room ID.");
    }
  };

  return (
    <div className="video-call-join">
      <h2>Enter or Generate Room ID</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn generate-btn" onClick={handleGenerateRoom}>
          Generate Room ID
        </button>
      </div>

      {generatedRoomId && (
        <div className="share-room">
          <p>Share this link to invite others:</p>
          <input type="text" value={`${window.location.origin}/video-call/${generatedRoomId}`} readOnly />
          <button className="btn copy-btn" onClick={copyToClipboard}>
            📋 Copy Link
          </button>
        </div>
      )}

      <button className="btn join-btn" onClick={joinRoom}>
        Join Video Call
      </button>

      {/* Return to Dashboard Button */}
      <button className="btn back-btn" onClick={() => navigate("/dashboard/user")}>
        ⬅ Return to Dashboard
      </button>
    </div>
  );
};

export default VideoCallJoin;

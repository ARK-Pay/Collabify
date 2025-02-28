import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid"; // To generate unique Room IDs
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import "./VideoChat.css"; // Ensure you have this imported for styling

const socket = io("http://localhost:3001", {
    transports: ["websocket"], // Ensures WebSocket connection
    withCredentials: true // Prevents CORS issues
});

const VideoChat = () => {
    const { roomId } = useParams(); // Fetch roomId from URL params
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const myVideo = useRef();
    const navigate = useNavigate();
    const [currentRoomId, setCurrentRoomId] = useState(roomId || ""); // Default roomId is empty if not passed

    useEffect(() => {
        if (roomId) {
            // Get user media (camera and microphone) and join the room
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
                setStream(mediaStream);
                if (myVideo.current) myVideo.current.srcObject = mediaStream;
                socket.emit("join-room", roomId, socket.id);
            });

            socket.on("user-connected", (userId) => {
                const peer = new Peer({ initiator: true, trickle: false, stream });

                peer.on("signal", (signal) => {
                    socket.emit("send-signal", { userId, signal });
                });

                peer.on("stream", (userStream) => {
                    setPeers((prev) => [...prev, { id: userId, stream: userStream }]);
                });

                socket.on("receive-signal", ({ signal }) => {
                    peer.signal(signal);
                });
            });
        }

        return () => socket.disconnect(); // Clean up on unmount
    }, [roomId]);

    // Function to join an existing room
    const joinRoom = () => {
        if (currentRoomId.trim()) {
            navigate(`/video-call/${currentRoomId}`); // Join the room based on entered room ID
        }
    };

    // Function to create a new room with a unique ID
    const createRoom = () => {
        const newRoomId = uuidv4().slice(0, 8); // Generate an 8-character unique ID
        setCurrentRoomId(newRoomId);
        navigate(`/video-call/${newRoomId}`); // Navigate to the generated room ID
    };

    return (
        <div className="video-chat-container">
            {!roomId ? (
                <div>
                    <h2>Enter Room ID or Create New</h2>
                    <div className="button-group">
                        <TextField
                            label="Enter Room ID"
                            value={currentRoomId}
                            onChange={(e) => setCurrentRoomId(e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                        <Button variant="contained" color="primary" onClick={joinRoom} disabled={!currentRoomId}>
                            Join Room
                        </Button>
                        <Button variant="contained" color="secondary" onClick={createRoom}>
                            Generate Room ID
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Room ID: {roomId}</h2>
                    <div className="video-container">
                        <video ref={myVideo} autoPlay muted className="video-box" />
                        {peers.map((peer) => (
                            <video key={peer.id} ref={(video) => { if (video) video.srcObject = peer.stream }} autoPlay className="video-box" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoChat;

import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import io from "socket.io-client";

const socket = io("http:// 192.168.1.81");

const VideoConference = () => {
    const [peers, setPeers] = useState([]);
    const videoGrid = useRef(null);
    const streamRef = useRef(null);
    const videoRefs = useRef({}); // Store video elements by user ID
    const peerRefs = useRef({}); // Store peer connections

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            streamRef.current = stream;

            // Add local video only once
            if (!videoRefs.current["local"]) {
                const myVideo = document.createElement("video");
                myVideo.srcObject = stream;
                myVideo.autoplay = true;
                myVideo.muted = true;
                myVideo.id = "local-video";
                videoGrid.current.appendChild(myVideo);
                videoRefs.current["local"] = myVideo;
            }

            socket.emit("join-room");

            socket.on("user-joined", (userId) => {
                if (!peerRefs.current[userId]) {
                    const peer = createPeer(userId, stream);
                    peerRefs.current[userId] = peer;
                }
            });

            socket.on("receive-call", ({ signal, from }) => {
                if (!peerRefs.current[from]) {
                    const peer = addPeer(from, signal, stream);
                    peerRefs.current[from] = peer;
                }
            });

            socket.on("call-accepted", ({ signal, from }) => {
                if (peerRefs.current[from]) {
                    peerRefs.current[from].signal(signal);
                }
            });

            socket.on("user-disconnected", (userId) => {
                if (peerRefs.current[userId]) {
                    peerRefs.current[userId].destroy();
                    delete peerRefs.current[userId];
                }
                if (videoRefs.current[userId]) {
                    videoGrid.current.removeChild(videoRefs.current[userId]);
                    delete videoRefs.current[userId];
                }
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function createPeer(userId, stream) {
        const peer = new SimplePeer({ initiator: true, trickle: false, stream });

        peer.on("signal", (signal) => socket.emit("call-user", { signal, to: userId }));
        peer.on("stream", (userStream) => {
            if (!videoRefs.current[userId]) {
                addVideoStream(userStream, userId);
            }
        });

        return peer;
    }

    function addPeer(userId, incomingSignal, stream) {
        const peer = new SimplePeer({ initiator: false, trickle: false, stream });

        peer.signal(incomingSignal);
        peer.on("signal", (signal) => socket.emit("accept-call", { signal, from: userId }));
        peer.on("stream", (userStream) => {
            if (!videoRefs.current[userId]) {
                addVideoStream(userStream, userId);
            }
        });

        return peer;
    }

    function addVideoStream(stream, userId) {
        if (videoRefs.current[userId]) return; // Prevent duplicate video

        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.id = `video-${userId}`;

        videoGrid.current.appendChild(video);
        videoRefs.current[userId] = video;
    }

    return (
        <div>
            <h2>Video Conference</h2>
            <div ref={videoGrid} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }} />
        </div>
    );
};

export default VideoConference;

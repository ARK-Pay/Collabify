const { Server } = require("socket.io");

module.exports = function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Change this to match your frontend URL if needed
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Handle screen sharing event
        socket.on("share-screen", (data) => {
            socket.broadcast.emit("screen-shared", data);
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

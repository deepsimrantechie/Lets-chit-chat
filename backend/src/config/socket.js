import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize socket.io with the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your client URL
  },
});

// Handling socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Socket event handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(4001, () => {
  console.log("Server running on port 4001");
});

const cookie = require("cookie");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
async function initSocketServer(httpServer) {
    // Create a new instance of Socket.IO server
    const io = new Server(httpServer, {});
    io.use(async (socket, next) => {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      if (!cookies.token) {
        return next(new Error("Authentication error"));
      }
      // If the token is present, you can perform additional checks here
      try {
        const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        socket.user = user; // Store user ID in socket for later use
      } catch (err) {
        return next(new Error("Authentication error"));
      }
      // If the token is present, proceed to the next middleware
      next();
    });
  
    // Handle connection event
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);
      socket.on("send-location", async (data) => {
        console.log("Location received:", data);

        io.emit("receive-location", {
            userId: socket.id,
            latitude: 28.61 + Math.random() * 0.01, // around New Delhi
            longitude: 77.20 + Math.random() * 0.01,
          });
          
      });
  
      // Handle disconnection event
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  // Export the init function to be used in the main server file
  module.exports = initSocketServer;
// socket.js
import { Server } from "socket.io";
import { verifyClerkToken } from "./middleware/auth.js";
import Message from "./db/message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // or specific origin like http://localhost:3000
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const session = await verifyClerkToken(token);
      socket.user = session.userId;
      next();
    } catch (err) {
      console.error("Auth failed:", err);
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("✅ User connected:", socket.user);

    // Send recent messages to the new client
    try {
      const recentMessages = await Message.find({})
        .sort({ timestamp: 1 })
        .limit(50)
        .lean();
      socket.emit("chat_history", recentMessages);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }

    socket.on("send_message", async (data) => {
      try {
        const msg = await Message.create({
          userId: socket.user,
          message: data.message,
        });
        io.emit("receive_message", {
          from: socket.user,
          message: msg.message,
          timestamp: msg.timestamp,
        });
      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.user);
    });
  });

  return io;
};

// server.js
import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./db/connection.js";
import { initSocket } from "./socket.js";
import Message from "./db/message.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// init socket
initSocket(server);

// DB connect
connectToDB();

// Test route
app.get("/", (req, res) => {
  res.send("Chat server is running");
});


app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// API to fetch recent messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find({})
      .sort({ timestamp: 1 })
      .limit(50)
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

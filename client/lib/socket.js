// lib/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to socket");
  });

  return socket;
};

export const getSocket = () => socket;

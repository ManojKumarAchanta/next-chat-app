// lib/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io("https://sockets-zs7k.onrender.com", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to socket");
  });

  return socket;
};

export const getSocket = () => socket;

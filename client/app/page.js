// app/page.js
"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { connectSocket, getSocket } from "../lib/socket";

const CLERK_API_BASE = "https://api.clerk.dev/v1/users/";

export default function Home() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCache, setUserCache] = useState({});
  const [error, setError] = useState(null);
  const chatRef = useRef(null);

  // Helper to fetch user info from Clerk API
  const fetchUserInfo = async (userId) => {
    if (userCache[userId]) return userCache[userId];
    try {
      const res = await fetch(`/api/clerk-user?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();
      setUserCache((prev) => ({ ...prev, [userId]: data }));
      return data;
    } catch (err) {
      setUserCache((prev) => ({ ...prev, [userId]: { first_name: "Unknown", image_url: "" } }));
      return { first_name: "Unknown", image_url: "" };
    }
  };

  useEffect(() => {
    if (!user) return;
    let socket;
    setLoading(true);
    setError(null);
    setMessages([]);
    setUserCache({});

    const init = async () => {
      const token = await getToken();
      socket = connectSocket(token);

      socket.on("chat_history", async (history) => {
        // Fetch user info for all unique userIds
        const uniqueIds = [...new Set(history.map((m) => m.userId))];
        await Promise.all(uniqueIds.map(fetchUserInfo));
        setMessages(history);
        setLoading(false);
      });

      socket.on("receive_message", async (data) => {
        if (data.from !== "Me" && !userCache[data.from]) {
          await fetchUserInfo(data.from);
        }
        setMessages((prev) => [...prev, data]);
      });

      socket.on("connect_error", (err) => {
        setError("Socket connection error: " + err.message);
        setLoading(false);
      });
    };

    init();
    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const socket = getSocket();
    if (message.trim() && socket) {
      socket.emit("send_message", { message });
      setMessages((prev) => [
        ...prev,
        {
          from: "Me",
          message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        Please <a href="/sign-in" className="text-blue-600 underline">sign in</a> to use the chat.
      </div>
    </div>
  );

  return (
    <div className="flex flex-col text-black items-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-xl bg-white rounded shadow p-6 flex flex-col">
        <div className="flex items-center mb-4">
          <img src={user.imageUrl} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
          <h2 className="text-xl font-semibold">Hello, {user.firstName} 👋</h2>
        </div>
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto border rounded p-4 bg-gray-50 mb-4 h-80"
        >
          {loading ? (
            <div className="text-center text-gray-500">Loading chat...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.from === "Me" || m.userId === user.id || m.from === user.id;
              const senderId = m.from === "Me" ? user.id : m.from || m.userId;
              const sender = senderId === user.id
                ? { first_name: user.firstName, image_url: user.imageUrl }
                : userCache[senderId] || { first_name: "...", image_url: "" };
              return (
                <div
                  key={i}
                  className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <img
                      src={sender.image_url || "/avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full mr-2 self-end"
                    />
                  )}
                  <div className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                    <div className="font-semibold mb-1">{isMe ? "Me" : sender.first_name}</div>
                    <div>{m.message}</div>
                    {m.timestamp && (
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                  {isMe && (
                    <img
                      src={user.imageUrl}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ml-2 self-end"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            // disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-5 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
            // disabled={loading || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  userId: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)
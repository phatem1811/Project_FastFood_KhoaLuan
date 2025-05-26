import mongoose from 'mongoose';

const guestChatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true, expireAfterSeconds: 24 * 60 * 60 }
);

export default mongoose.models.GuestChatMessage || mongoose.model('GuestChatMessage', guestChatMessageSchema);
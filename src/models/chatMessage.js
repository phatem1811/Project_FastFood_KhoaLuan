import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot', 'agent'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
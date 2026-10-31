import mongoose from 'mongoose';

const SubtitleSchema = new mongoose.Schema({
  targetType: { type: String, enum: ['movie', 'episode'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  language: { type: String, required: true },
  label: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Subtitle || mongoose.model('Subtitle', SubtitleSchema);
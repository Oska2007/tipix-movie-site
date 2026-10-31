import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  poster: String,
  backdrop: String,
  year: Number,
  rating: Number,
  genres: [String],
  duration: String,
  language: { type: String, default: 'English' },
  torrentMagnet: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
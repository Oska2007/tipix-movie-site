import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  poster: String,
  backdrop: String,
  year: Number,
  rating: Number,
  genres: [String],
  language: { type: String, default: 'English' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Series || mongoose.model('Series', SeriesSchema);
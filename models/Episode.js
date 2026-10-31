import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season', required: true },
  season: { type: Number, required: true },
  episode: { type: Number, required: true },
  title: String,
  torrentMagnet: { type: String, required: true },
  fileIndex: { type: Number, required: true },
  fileName: String,
  size: Number,
  duration: String,
  createdAt: { type: Date, default: Date.now },
});

EpisodeSchema.index({ seriesId: 1, season: 1, episode: 1 });

export default mongoose.models.Episode || mongoose.model('Episode', EpisodeSchema);
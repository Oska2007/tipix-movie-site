import mongoose from 'mongoose';

const SeasonSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  seasonNumber: { type: Number, required: true },
  torrentMagnet: { type: String, required: true },
  infoHash: String,
  torrentName: String,
  totalFiles: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

SeasonSchema.index({ seriesId: 1, seasonNumber: 1 }, { unique: true });

export default mongoose.models.Season || mongoose.model('Season', SeasonSchema);
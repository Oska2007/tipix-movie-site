import { connectDB } from '@/lib/mongodb';
import Season from '@/models/Season';
import Episode from '@/models/Episode';
import Subtitle from '@/models/Subtitle';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();
  const season = await Season.findById(params.id).lean();
  if (!season) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const episodes = await Episode.find({ seasonId: params.id }).sort({ episode: 1 }).lean();

  const withSubs = await Promise.all(episodes.map(async (ep) => {
    const subs = await Subtitle.find({ targetType: 'episode', targetId: ep._id })
      .select('_id language label')
      .lean();
    return { ...ep, subtitles: subs };
  }));

  return NextResponse.json({ ...season, episodes: withSubs });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const episodes = await Episode.find({ seasonId: params.id }).select('_id').lean();
  await Subtitle.deleteMany({ targetType: 'episode', targetId: { $in: episodes.map(e => e._id) } });
  await Episode.deleteMany({ seasonId: params.id });
  await Season.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
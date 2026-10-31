import { connectDB } from '@/lib/mongodb';
import Episode from '@/models/Episode';
import Subtitle from '@/models/Subtitle';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();
  const ep = await Episode.findById(params.id).populate('seriesId', 'title').lean();
  if (!ep) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const subtitles = await Subtitle.find({ targetType: 'episode', targetId: params.id }).lean();

  return NextResponse.json({ ...ep, subtitles });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const update = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.fileIndex !== undefined) update.fileIndex = body.fileIndex;
  const ep = await Episode.findByIdAndUpdate(params.id, { $set: update }, { new: true });
  return NextResponse.json(ep);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Subtitle.deleteMany({ targetType: 'episode', targetId: params.id });
  await Episode.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
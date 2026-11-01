import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { liveUsers } from '@/lib/schema';
import { gt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// 1. අලුත් සිග්නල් එකක් එවද්දී (Ping)
export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    
    // අලුත් එකක් නම් Insert, පරණ එකක් නම් Update
    db.insert(liveUsers)
      .values({ id: sessionId, lastPing: Date.now() })
      .onConflictDoUpdate({
        target: liveUsers.id,
        set: { lastPing: Date.now() },
      })
      .run();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. දැනට ඉන්න ගණන ගන්න (Admin සඳහා)
export async function GET() {
  try {
    // පසුගිය මිනිත්තු 2 ඇතුළත සිග්නල් එවපු අය විතරක් ගණන් කරනවා
    const twoMinsAgo = Date.now() - (2 * 60 * 1000);
    
    const activeUsers = db.select()
      .from(liveUsers)
      .where(gt(liveUsers.lastPing, twoMinsAgo))
      .all();

    return NextResponse.json({ count: activeUsers.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
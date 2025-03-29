import { DataFileSync } from 'lowdb/node';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Handle GET request
  const dbData: DataFileSync<{
    subscriptions: { subscription: PushSubscription; deviceID: string }[];
  }> = new DataFileSync('/public/db.json', {
    parse: data => JSON.parse(data),
    stringify: data => JSON.stringify(data),
  });
  const dataInDB = await dbData.read();
  if (!dataInDB) {
    return NextResponse.json({ subscriptions: [] }, { status: 200 });
  } else
    return NextResponse.json(
      { subscriptions: dataInDB.subscriptions },
      { status: 200 },
    );
}

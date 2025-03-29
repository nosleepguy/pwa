import { dbFileLink } from '@/constant';
import { DataFileSync } from 'lowdb/node';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Handle GET request
  try {
    const dbData: DataFileSync<{
      subscriptions: { subscription: PushSubscription; deviceID: string }[];
    }> = new DataFileSync(dbFileLink, {
      parse: data => JSON.parse(data),
      stringify: data => JSON.stringify(data),
    });

    const dataInDB = dbData.read();
    console.log('🚀 ~ GET ~ dataInDB:', dataInDB);
    if (!dataInDB) {
      return NextResponse.json({ subscriptions: [] }, { status: 200 });
    } else
      return NextResponse.json(
        { subscriptions: dataInDB.subscriptions },
        { status: 200 },
      );
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
  }
}

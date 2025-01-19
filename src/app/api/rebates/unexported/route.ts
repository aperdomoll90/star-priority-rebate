import connectToMongodb from '@/utils/mongoConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToMongodb();
    const transactions = await db.collection('rebate_transactions').find({ exported: false }).toArray();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching non-exported transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}


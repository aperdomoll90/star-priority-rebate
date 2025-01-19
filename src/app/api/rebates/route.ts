import connectToMongodb from '@/utils/mongoConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToMongodb();
    const transactions = await db.collection('rebate_transactions').find().toArray(); // Adjust based on your DB library
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.error();
  }
}

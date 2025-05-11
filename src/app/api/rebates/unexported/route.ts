import connectToMongodb from '@/utils/mongoConnect';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const db = await connectToMongodb();
    const transactions = await db.collection('rebate_transactions').find({ exported: false }).toArray();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching non-exported transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}


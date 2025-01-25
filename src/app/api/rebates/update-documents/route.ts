import { NextResponse } from 'next/server'
import connectToMongodb from '@/utils/mongoConnect'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  try {
    const { rebates } = await req.json()

    const db = await connectToMongodb()

    const ids = rebates.map((rebate: any) => new ObjectId(rebate._id))

    const result = await db.collection('rebate_transactions').updateMany({ _id: { $in: ids } }, { $set: { exported: true } })


    return NextResponse.json({ success: true, updatedCount: result.modifiedCount })
  } catch (error) {
    console.error('Error updating exported status:', error)
    return NextResponse.json({ error: 'Failed to update exported status' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import connectToMongodb from '@/utils/mongoConnect'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { rebates } = await req.json()

    if (!Array.isArray(rebates) || rebates.length === 0) {
      return NextResponse.json({ error: 'No rebate data provided' }, { status: 400 })
    }

    const db = await connectToMongodb()
    const ids = rebates.map((rebate: any) => new ObjectId(rebate._id))

    const result = await db.collection('rebate_transactions').updateMany({ _id: { $in: ids } }, { $set: { exported: true } })

    return NextResponse.json({ success: true, updatedCount: result.modifiedCount })
  } catch (error) {
    console.error('Error updating exported status:', error)
    return NextResponse.json({ error: 'Failed to update exported status' }, { status: 500 })
  }
}

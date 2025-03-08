import connectToMongodb from '@/utils/mongoConnect'
import { IInterestTypes, IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  api: {
    bodyParser: true,
  },
}

// Function to generate a unique 5-character alphanumeric ID
async function generateUniqueId(db: any) {
  let uniqueId = '' // Initialize the variable
  let exists = true

  while (exists) {
    // Generate a random 5-character alphanumeric ID
    uniqueId = Math.random().toString(36).substring(2, 7).toUpperCase()

    // Check if the ID already exists in the database
    const existingDoc = await db.collection('rebate_transactions').findOne({ unique_id: uniqueId })
    exists = !!existingDoc // If document exists, regenerate ID
  }

  return uniqueId
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  try {
    const body = await req.json()
    const db = await connectToMongodb()

    const uniqueId = await generateUniqueId(db)

    const dateAdded = new Date().toISOString()

    const formData: Partial<IUserRebateInfoProps> = {
      ...body,
      user_id: uniqueId,
      date_added: dateAdded,
      interests: body.interests as IInterestTypes[],
      subscription: Boolean(body.subscription),
      exported: false,
      receipt_image: body.receipt_image,
      coupon_image: `https://picsum.photos/seed/200/300`,
      product_barcode_image: `https://picsum.photos/seed/200/300`,
    }

    await db.collection('rebate_transactions').insertOne(formData as IUserRebateInfoProps)

    return NextResponse.json({ confirmationNumber: uniqueId }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

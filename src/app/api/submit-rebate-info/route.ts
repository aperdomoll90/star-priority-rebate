import connectToMongodb from '@/app/utils/mongoConnect'
import { IInterestTypes, IUserRebateInfoProps } from '@/app/utils/userRebateInfoTypes'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  api: {
      bodyParser: true, // Enable default body parser for JSON
  },
};

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
  try {
    const rawBody = await req.body; // Log raw body for debugging
    console.log('Raw request body:', rawBody);

    const body = await req.json();
    console.log('Request body data received:', body)

    const formData: Partial<IUserRebateInfoProps> = {
      ...body,
      date_added: new Date(),
      interests: body.interests as IInterestTypes[],
      subscription: Boolean(body.subscription),
      exported: false,
      receipt_image: `https://picsum.photos/seed/200/300`,
      coupon_image: `https://picsum.photos/seed/200/300`,
      product_barcode_image: `https://picsum.photos/seed/200/300`,
    }

    console.log('Ready to connect data received:', formData)

    const db = await connectToMongodb();
    const result = await db.collection('rebate_transactions').insertOne(formData as IUserRebateInfoProps)

    const confirmationNumber = result.insertedId.toString()

    return NextResponse.json({ confirmationNumber }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

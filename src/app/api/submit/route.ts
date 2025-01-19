import connectToMongodb from '@/utils/mongoConnect'
import { IInterestTypes, IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
  try {
    const body = await req.json()

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

    const db = await connectToMongodb()
    const result = await db.collection('rebate_transactions').insertOne(formData as IUserRebateInfoProps)

    const confirmationNumber = result.insertedId.toString()
    console.log('Successfully inserted document')
    return NextResponse.json({ confirmationNumber }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

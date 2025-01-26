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

    const dateAdded = new Date();

    function formatDate(dateAdded:any) {
      const year = dateAdded.getFullYear();
      const month = String(dateAdded.getMonth() + 1).padStart(2, '0');
      const day = String(dateAdded.getDate()).padStart(2, '0');
      const hours = String(dateAdded.getHours()).padStart(2, '0');
      const minutes = String(dateAdded.getMinutes()).padStart(2, '0');
      const seconds = String(dateAdded.getSeconds()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    const formattedDate = formatDate(dateAdded);

    const formData: Partial<IUserRebateInfoProps> = {
      ...body,
      date_added: formattedDate,
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
    return NextResponse.json({ confirmationNumber }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

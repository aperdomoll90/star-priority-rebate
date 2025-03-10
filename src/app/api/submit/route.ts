import connectToMongodb from '@/utils/mongoConnect'
import { IInterestTypes, IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const config = {
  api: {
    bodyParser: false,
  },
}

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
  throw new Error('Missing required AWS environment variables')
}

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'default-region',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
})

async function uploadFileToS3(file: File, userId: string): Promise<string> {
  const uniqueFileName = `${userId}receiptimage`;

  const fileBuffer = await file.arrayBuffer();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  });

  await s3.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;
}


async function generateUniqueId(db: any) {
  let uniqueId = ''
  let exists = true

  while (exists) {
    uniqueId = Math.random().toString(36).substring(2, 7).toUpperCase()
    const existingDoc = await db.collection('rebate_transactions').findOne({ unique_id: uniqueId })
    exists = !!existingDoc
  }

  return uniqueId
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  try {
    const formData = await req.formData()
    const db = await connectToMongodb()

    const uniqueId = await generateUniqueId(db)
    const dateAdded = new Date()

    const receiptImage = formData.get('receipt_image') as File | null
    let receiptImageUrl = ''

    if (receiptImage) {
      receiptImageUrl = await uploadFileToS3(receiptImage, uniqueId)
    }

    const interests = formData.getAll('interests') as string[]

    const formDataObject: Partial<IUserRebateInfoProps> = {
      user_id: uniqueId,
      date_added: dateAdded,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      address2: formData.get('address2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      country: formData.get('country') as string,
      store_name: formData.get('store_name') as string,
      store_city: formData.get('store_city') as string,
      comments1: formData.get('comments1') as string,
      interests: interests as IInterestTypes[],
      subscription: formData.get('subscription') === 'true',
      product_code: formData.get('product_code') as string,
      redeem_code: formData.get('redeem_code') as string,
      exported: false,
      receipt_image: receiptImageUrl,
      coupon_image: `https://picsum.photos/seed/200/300`,
      product_barcode_image: `https://picsum.photos/seed/200/300`,
    }

    await db.collection('rebate_transactions').insertOne(formDataObject as IUserRebateInfoProps)

    return NextResponse.json({ confirmationNumber: uniqueId }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

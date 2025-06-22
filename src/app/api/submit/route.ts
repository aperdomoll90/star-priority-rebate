import connectToMongodb from '@/utils/mongoConnect'
import { IInterestTypes, IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import {
  addProfileToKlaviyoList,
  checkIfKlaviyoProfileExists,
  createKlaviyoProfile,
  sendMailjetConfirmation,
  syncKlaviyoProfileIfChanged,
} from './utils'

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

async function uploadFileToS3(file: File, userId: string, label: string): Promise<string> {
  const uniqueFileName = `${userId}-${label}`

  const fileBuffer = await file.arrayBuffer()
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  })

  await s3.send(command)
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`
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

async function sendUserConfirmationEmail({
  email,
  first_name,
  last_name,
  city,
  state,
  zip,
  country,
  subscription,
  product_code,
  redeem_code,
}: {
  email: string
  first_name: string
  last_name: string
  city: string
  state: string
  zip: string
  country: string
  subscription?: boolean
  product_code: string
  redeem_code: string
}) {
  try {
    let profileId: string | undefined = undefined

    if (subscription) {
      const { exists, profileId: existingProfileId, profileData } = await checkIfKlaviyoProfileExists(email)
      const expectedProps = { city, state, zip, country }
      
      if (exists) {
        await syncKlaviyoProfileIfChanged({
          profileId: existingProfileId as string,
          profileData,
          email,
          first_name,
          last_name,
          properties: expectedProps,
        })
        profileId = existingProfileId
        console.info('👤 Klaviyo profile already exists:', profileId)
      } else {
        const { success, profileId: newProfileId } = await createKlaviyoProfile({
          email,
          first_name,
          last_name,
          properties: {
            city,
            state,
            zip,
            country,
          },
        })

        if (!success || !newProfileId) {
          throw new Error('Failed to create Klaviyo profile')
        }

        profileId = newProfileId
        console.info('🆕 Created new Klaviyo profile:', profileId)
      }

      if (profileId) {
        const added = await addProfileToKlaviyoList(profileId)
        if (added) {
          console.log('✅ Profile added to Klaviyo list')
        } else {
          console.error('⚠️ Failed to add profile to Klaviyo list')
          throw new Error('Failed  to add profile to Klaviyo list')
        }
      }
    }

    await sendMailjetConfirmation({
      to: email,
      firstName: first_name,
      userCode: redeem_code,
      productCode: product_code,
    })

    console.log('📩 Confirmation event sent for profile:', email)
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error)
    throw new Error('Failed to send confirmation email')
  }
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
    const couponImage = formData.get('coupon_image') as File | null
    const barcodeImage = formData.get('product_barcode_image') as File | null

    let receiptImageUrl = ''
    let couponImageUrl = ''
    let barcodeImageUrl = ''

    if (receiptImage) {
      receiptImageUrl = await uploadFileToS3(receiptImage, uniqueId, 'receiptimage')
    }

    if (couponImage) {
      couponImageUrl = await uploadFileToS3(couponImage, uniqueId, 'couponimage')
    }

    if (barcodeImage) {
      barcodeImageUrl = await uploadFileToS3(barcodeImage, uniqueId, 'barcodeimage')
    }

    const interests = formData.getAll('interests') as string[]

    const formDataObject: Partial<IUserRebateInfoProps> = {
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
      redeem_code: uniqueId, // This is the unique user ID we assign
      exported: false,
      receipt_image: receiptImageUrl,
      coupon_image: couponImageUrl,
      product_barcode_image: barcodeImageUrl,
    }

    await db.collection('rebate_transactions').insertOne(formDataObject as IUserRebateInfoProps)

    await sendUserConfirmationEmail({
      email: formDataObject.email!,
      first_name: formDataObject.first_name!,
      last_name: formDataObject.last_name!,
      city: formDataObject.city!,
      state: formDataObject.state!,
      zip: formDataObject.zip!,
      country: formDataObject.country!,
      subscription: formDataObject.subscription!,
      product_code: formDataObject.product_code!,
      redeem_code: formDataObject.redeem_code!,
    })

    return NextResponse.json({ confirmationNumber: formDataObject.redeem_code! }, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

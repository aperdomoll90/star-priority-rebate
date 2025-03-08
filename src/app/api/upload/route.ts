import { S3Client } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

// Ensure all environment variables are loaded properly
if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
  throw new Error('Missing required AWS environment variables')
}

// Set up S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const body = req.body
  console.log('**** upload entered ****', body)

  return NextResponse.json({ body: body }, { status: 200 })
}

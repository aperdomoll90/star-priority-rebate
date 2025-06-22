import { NextRequest, NextResponse } from 'next/server'
import mailjet from 'node-mailjet'
import { IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'

const mailjetClient = mailjet.apiConnect(process.env.MAILJET_APIKEY_PUBLIC!, process.env.MAILJET_APIKEY_PRIVATE!)

export async function POST(req: NextRequest) {
  try {
    const { rebates } = await req.json()

    if (!Array.isArray(rebates)) {
      return NextResponse.json({ error: 'Missing or invalid rebate data' }, { status: 400 })
    }

    const adminEmail = process.env.MAILJET_DOWNLOADED_RECIPIENT!
    const fromEmail = process.env.MAILJET_FROM_EMAIL!
    const fromName = process.env.MAILJET_FROM_NAME!

    const results: { id: string; success: boolean }[] = []

    for (const rebate of rebates as IUserRebateInfoProps[]) {
      try {
        const fetchImage = async (url?: string) => {
          if (!url) return null
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to fetch image: ${url}`)
          const buffer = await res.arrayBuffer()
          return Buffer.from(buffer).toString('base64')
        }

        const receiptImage = await fetchImage(rebate.receipt_image as string)
        const couponImage = await fetchImage(rebate.coupon_image as string)
        const barcodeImage = await fetchImage(rebate.product_barcode_image as string)

        const HTMLPart = `
          <h2>📄 New Rebate Submission</h2>
          <p><strong>Name:</strong> ${rebate.first_name} ${rebate.last_name}</p>
          <p><strong>Email:</strong> ${rebate.email}</p>
          <p><strong>Phone:</strong> ${rebate.phone}</p>
          <p><strong>Address:</strong> ${rebate.address} ${rebate.address2 || ''}, ${rebate.city}, ${rebate.state} ${rebate.zip}, ${
          rebate.country
        }</p>
          <p><strong>Product Code:</strong> ${rebate.product_code}</p>
          <p><strong>User ID/Code:</strong> ${rebate.redeem_code}</p>
          <p><strong>Subscription:</strong> ${rebate.subscription ? 'Yes' : 'No'}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
            <div><p style="margin:0"><strong>Receipt:</strong></p><img src="cid:receipt@image" width="200" /></div>
            <div><p style="margin:0"><strong>Coupon:</strong></p><img src="cid:coupon@image" width="200" /></div>
            <div><p style="margin:0"><strong>Barcode:</strong></p><img src="cid:barcode@image" width="200" /></div>
          </div>
        `

        const InlinedAttachments = []

        if (receiptImage) {
          InlinedAttachments.push({
            ContentType: 'image/png',
            Filename: 'receipt.png',
            ContentID: 'receipt@image',
            Base64Content: receiptImage,
          })
        }

        if (couponImage) {
          InlinedAttachments.push({
            ContentType: 'image/png',
            Filename: 'coupon.png',
            ContentID: 'coupon@image',
            Base64Content: couponImage,
          })
        }

        if (barcodeImage) {
          InlinedAttachments.push({
            ContentType: 'image/png',
            Filename: 'barcode.png',
            ContentID: 'barcode@image',
            Base64Content: barcodeImage,
          })
        }

        await mailjetClient.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: { Email: fromEmail, Name: fromName },
              To: [{ Email: adminEmail, Name: 'Admin' }],
              Subject: `🧾 Rebate from ${rebate.first_name} ${rebate.last_name}`,
              HTMLPart,
              InlinedAttachments,
              CustomID: `Rebate-${rebate.redeem_code}`,
            },
          ],
        })

        console.log(`✅ Email sent for ${rebate.redeem_code}`)
        results.push({ id: rebate.redeem_code as string, success: true })
      } catch (err) {
        console.error(`❌ Failed to send email for ${rebate.redeem_code}:`, err)
        results.push({ id: rebate.redeem_code as string, success: false })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('❌ send-rebate-emails error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

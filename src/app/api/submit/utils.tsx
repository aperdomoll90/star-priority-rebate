import mailjet from 'node-mailjet'

export type KlaviyoProfileData = {
  type: 'profile';
  id: string;
  attributes: {
    email: string;
    phone_number: string | null;
    external_id: string | null;
    anonymous_id: string | null;
    first_name: string;
    last_name: string;
    organization: string | null;
    locale: string | null;
    title: string | null;
    image: string | null;
    created: string;
    updated: string;
    last_event_date: string | null;
    location: {
      country: string | null;
      address1: string | null;
      region: string | null;
      zip: string | null;
      city: string | null;
      longitude: number | null;
      latitude: number | null;
      address2: string | null;
      timezone: string | null;
      ip: string | null;
    };
    properties?: {
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      [key: string]: any;
    };
  };
  relationships: {
    lists: { links: Record<string, string> };
    segments: { links: Record<string, string> };
    'push-tokens': { links: Record<string, string> };
    conversation: { links: Record<string, string> };
  };
  links: {
    self: string;
  };
};



const mailjetClient = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC!, process.env.MJ_APIKEY_PRIVATE!)

export async function sendMailjetConfirmation({
  to,
  firstName,
  userCode,
  productCode,
}: {
  to: string
  firstName?: string
  userCode: string
  productCode: string
}) {
  try {
    const { body } = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME!,
          },
          To: [
            {
              Email: to,
              Name: firstName ?? 'there',
            },
          ],
          Subject: 'Your Rebate Confirmation',
          HTMLPart: `
              <p>Hi ${firstName ?? 'there'},</p>
              <p>Thanks for submitting your rebate request!</p>
              <p><strong>Your Unique User ID Code:</strong> ${userCode}</p>
              <p><strong>Your Rebate Code:</strong> ${productCode}</p>
              <p>We’ll review your information and send you an update once it’s processed.</p>
              <br>
              <p>— The StarBrite Team</p>
            `,
          CustomID: 'RebateConfirmationEmail',
        },
      ],
    })

    console.log('✅ Mailjet sent:', body)
    return true
  } catch (err) {
    console.error('❌ Mailjet error:', err)
    return false
  }
}

export async function checkIfKlaviyoProfileExists(email: string): Promise<{
  exists: boolean
  profileId?: string
  profileData?: KlaviyoProfileData
}> {
  try {
    const url = `https://a.klaviyo.com/api/profiles?filter=equals(email,"${email}")`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2024-02-15',
      },
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('❌ Error checking Klaviyo profile:', error)
      return { exists: false }
    }

    const data = await res.json()
    const profileId = data?.data?.[0]?.id

    if (profileId) {
      console.log(`🟢 Klaviyo profile exists: ${profileId}`)
      return { exists: true, profileId, profileData: data?.data?.[0] }
    }

    console.log('🔍 No Klaviyo profile found for this email.')
    return { exists: false }
  } catch (err) {
    console.error('❌ Failed to fetch Klaviyo profile:', err)
    return { exists: false }
  }
}

export async function createKlaviyoProfile({
  email,
  first_name,
  last_name,
  properties = {},
}: {
  email: string
  first_name: string
  last_name: string
  properties?: Record<string, any>
}): Promise<{ success: boolean; profileId?: string }> {
  try {
    const profilePayload = {
      data: {
        type: 'profile',
        attributes: {
          email,
          first_name,
          last_name,
          properties,
        },
      },
    }

    const profileRes = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2024-02-15',
      },
      body: JSON.stringify(profilePayload),
    })

    const profileResult = await profileRes.json()

    if (!profileRes.ok) {
      console.error('❌ Failed to create Klaviyo profile:', profileResult)
      return { success: false }
    }

    const profileId = profileResult?.data?.id
    if (!profileId) {
      console.error('❌ No profile ID returned from Klaviyo')
      return { success: false }
    }

    return { success: true, profileId }
  } catch (err) {
    console.error('❌ Error creating/updating Klaviyo profile:', err)
    return { success: false }
  }
}

export async function syncKlaviyoProfileIfChanged({
  profileId,
  profileData,
  email,
  first_name,
  last_name,
  properties,
}: {
  profileId: string
  profileData: any
  email: string
  first_name: string
  last_name: string
  properties: Record<string, any>
}): Promise<boolean> {
  const current = profileData?.attributes ?? {}
  const currentProps = current?.properties ?? {}

  const hasDifferences =
    current.email !== email ||
    current.first_name !== first_name ||
    current.last_name !== last_name ||
    Object.entries(properties).some(([key, val]) => currentProps?.[key] !== val)

  if (!hasDifferences) {
    console.log('🟢 Klaviyo profile is already up to date.')
    return false
  }

  console.log('🔁 Updating Klaviyo profile...')

  const updatePayload = {
    data: {
      type: 'profile',
      id: profileId,
      attributes: {
        email,
        first_name,
        last_name,
        properties,
      },
    },
  }

  try {
    const res = await fetch(`https://a.klaviyo.com/api/profiles/${profileId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2024-02-15',
      },
      body: JSON.stringify(updatePayload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('❌ Failed to update Klaviyo profile:', errorText)
      return false
    }

    console.log('✅ Klaviyo profile updated successfully.')
    return true
  } catch (err) {
    console.error('❌ Error while updating Klaviyo profile:', err)
    return false
  }
}

export async function addProfileToKlaviyoList(profileId: string): Promise<boolean> {
  try {
    const listRes = await fetch(`https://a.klaviyo.com/api/lists/${process.env.KLAVIYO_LIST_ID}/relationships/profiles/`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2024-02-15',
      },
      body: JSON.stringify({
        data: [
          {
            type: 'profile',
            id: profileId,
          },
        ],
      }),
    })

    if (!listRes.ok) {
      const body = await listRes.text()
      console.error(`❌ Failed to subscribe profile ${profileId} to list:`, body)
      return false
    }

    return true
  } catch (err) {
    console.error('❌ Error adding profile to Klaviyo list:', err)
    return false
  }
}

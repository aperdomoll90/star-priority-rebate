'use client'

import { useState } from 'react'
import Button from '@/components/common/button/button'
import Loader from '@/components/common/loader/loader'
import ReCAPTCHA from 'react-google-recaptcha'
import styles from './ReCaptchaVerifier.module.scss'

interface ReCaptchaVerifierProps {
  onSuccess: () => void
  onFailure: (message: string) => void
  isVerifying: boolean
  setIsVerifying: (isVerifying: boolean) => void
}

const ReCaptchaVerifier = ({
  onSuccess,
  onFailure,
  isVerifying,
  setIsVerifying,
}: ReCaptchaVerifierProps) => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)

  const handleRecaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
  }

  const handleCaptchaSubmit = async () => {
    if (!captchaValue) {
      onFailure('Please complete the reCAPTCHA!')
      return
    }

    setIsVerifying(true)

    const recaptchaVerificationResponse = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captchaValue }),
    })

    if (!recaptchaVerificationResponse.ok) {
      const errorText = await recaptchaVerificationResponse.text()
      console.error('reCAPTCHA API error:', errorText)
      onFailure('reCAPTCHA verification failed, please try again.')
      setIsVerifying(false)
      return
    }

    const data = await recaptchaVerificationResponse.json()

    if (!data.success) {
      onFailure('reCAPTCHA verification failed, please try again.')
      setIsVerifying(false)
      return
    }

    onSuccess()
    setIsVerifying(false)
  }

  return (
    <div className={styles.recaptchaContainer}>
      <p>Please complete the reCAPTCHA to continue.</p>
      <ReCAPTCHA
        size='compact'
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        onChange={handleRecaptchaChange}
      />
      <Button
        label={isVerifying ? 'Verifying...' : 'Verify'}
        onClick={handleCaptchaSubmit}
        ariaLabel="Verify reCAPTCHA"
        disabled={isVerifying}
      />
      {isVerifying && <Loader />}
    </div>
  )
}

export default ReCaptchaVerifier

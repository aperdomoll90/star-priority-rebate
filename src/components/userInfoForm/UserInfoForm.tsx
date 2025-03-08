'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes'
import Modal from '../common/modal/modal'
import Button from '../common/button/button'
import styles from './UserInfoForm.module.scss'
import modalStyles from '../common/modal/modal.module.scss'
import { createValidationRules } from '@/utils/useFormValidation'
import Loader from '../common/loader/loader'
import ReCaptchaVerifier from '@/utils/ReCaptchaVerifier'
import UserInfoFields from './UserInfoFields'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { userInfoSchema, UserInfoSchemaType } from './userInfoSchema'

const initialFormData = {
  first_name: '',
  last_name: '',
  address: '',
  address2: '',
  city: '',
  zip: '',
  country: '',
  state: '',
  email: '',
  phone: '',
  store_name: '',
  store_city: '',
  comments1: '',
  interests: [],
  subscription: false,
  product_code: '',
  redeem_code: '',
  receipt_image: undefined,
}

const UserInfoForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInfoSchemaType>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: initialFormData,
  })

  const [formData, setFormData] = useState<Partial<IUserRebateInfoProps>>(initialFormData)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false)
  const [isCaptchaVisible, setIsCaptchaVisible] = useState<boolean>(false)
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState<boolean>(false)
  const [isFieldsScrollComplete, setIsFieldsScrollComplete] = useState(false)

  const handleFieldsScroll = (isComplete: boolean) => {
    setIsFieldsScrollComplete(isComplete)
  }

  const onSubmit = async (data: UserInfoSchemaType) => {
    setIsLoading(true)
    setIsCaptchaVisible(true)
  }

  const handleFormSubmit = async (data: UserInfoSchemaType) => {
    setError(null)
    setConfirmationNumber(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Submission failed')
        setIsLoading(false)
        return
      }

      const responseData = await response.json()
      setConfirmationNumber(responseData.confirmationNumber)
      setIsModalOpen(true)
      reset() // Reset form to initial values
      setIsLoading(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const handleCaptchaSuccess = () => {
    setIsCaptchaVerified(true)
    setIsCaptchaVisible(false)
    handleSubmit(handleFormSubmit)()
  }

  const handleCaptchaFailure = (message: string) => {
    setError(message)
    setIsLoading(false)
  }

  const handleImageUpload = async (file: File) => {
    console.log('handleImageUpload entered')
    try {
      // 1️⃣ Request a signed URL from your API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type }),
      })

      // console.log('response', response)

      if (!response.ok) {
        console.log('Failed to get signed URL', response)
      } else {
        console.log('Success to get signed URL', response)
      }
    } catch (error) {
      console.log('Image upload error:', error)
      setError('Error uploading the image.')
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className={styles['c-user-form']} encType='multipart/form-data'>
        <Controller name='first_name' control={control} render={({ field }) => <UserInfoFields  control={control} errors={errors} handleImageUpload={handleImageUpload} onScrollComplete={handleFieldsScroll} />} />
        <Button label='Submit' className={styles['c-user-form__submit-button']} ariaLabel='Submit rebate form' type='submit' disabled={!isFieldsScrollComplete} />
      </form>

      {isCaptchaVisible && (
        <div className={styles['recaptcha-wrapper']}>
          <ReCaptchaVerifier onSuccess={handleCaptchaSuccess} onFailure={handleCaptchaFailure} isVerifying={isVerifyingCaptcha} setIsVerifying={setIsVerifyingCaptcha} />
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {error ? (
          <>
            <h3 className={modalStyles.error_header}>Sorry!!</h3>
            <p className={modalStyles.error_message}>{error}</p>
          </>
        ) : confirmationNumber ? (
          <>
            <h3 className={modalStyles.success_header}>Thank you</h3>
            <p className={modalStyles.success_subheader}>
              Your <span>Starbrite</span> Priority Rebate ID is:
            </p>
            <p className={modalStyles.success_message}>{confirmationNumber}</p>
            <p className={modalStyles.success_disclaimer}>This info was sent to your email, please check your spam folder</p>
          </>
        ) : null}
      </Modal>
    </>
  )
}

export default UserInfoForm

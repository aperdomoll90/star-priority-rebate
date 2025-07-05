'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes'
import Modal from '../common/modal/modal'
import Button from '../common/button/button'
import styles from './UserInfoForm.module.scss'
import modalStyles from '../common/modal/modal.module.scss'
import Loader from '../common/loader/loader'
import ReCaptchaVerifier from '@/utils/ReCaptchaVerifier'
import UserInfoFields from './UserInfoFields'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userInfoSchema, UserInfoSchemaType } from './userInfoSchema'
import { Input, SubscribeCheckbox } from '../common/formElements/FormElements'
import { Constellations } from '../../../public/Constellations'

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
  receipt_image: undefined,
  coupon_image: undefined,
  product_barcode_image: undefined,
}

const UserInfoForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserInfoSchemaType>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: initialFormData,
    mode: 'onTouched',
  })

  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false)
  const [isCaptchaVisible, setIsCaptchaVisible] = useState<boolean>(false)
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState<boolean>(false)

  const router = useRouter()

  const onSubmit = async (data: UserInfoSchemaType) => {
    setIsLoading(true)
    setIsCaptchaVisible(true)
  }

  const handleFormSubmit = async (data: UserInfoSchemaType) => {
    setError(null)
    setConfirmationNumber(null)
    setIsLoading(true)

    try {
      const formData = new FormData()

      Object.keys(data).forEach(key => {
        const value = (data as Record<string, unknown>)[key]
        if (key === 'receipt_image' && value instanceof File) {
          formData.append(key, value)
        } else if (key === 'coupon_image' && value instanceof File) {
          formData.append(key, value)
        } else if (key === 'product_barcode_image' && value instanceof File) {
          formData.append(key, value)
        } else if (Array.isArray(value)) {
          value.forEach((item: string) => formData.append(key, item))
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string)
        }
      })

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Submission failed')
      }

      const responseData = await response.json()
      setConfirmationNumber(responseData.confirmationNumber)
      setIsModalOpen(true)
      reset()
    } catch (error: unknown) {
      console.error('Error submitting form:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
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

  const handleSuccessModalClose = () => {
    setIsModalOpen(false)
    reset()
  }

  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className={styles['c-user-form']} encType='multipart/form-data'>
        <div className={styles['c-user-form__title']}>
          <Constellations className={styles['c-user-form__title-constellation']} />
          <h1>StarPriority</h1>
          <h4>Starbrite Rebate Form</h4>
        </div>

        <div className={`${styles['c-user-form__content-column']}`}>
          <Controller name='first_name' control={control} render={({ field }) => <UserInfoFields control={control} errors={errors} />} />
        </div>

        <div className={`${styles['c-user-form__action-section']}`}>
          <Input
            error={errors.product_code}
            control={control}
            className={`${styles['c-user-form__action-section--input']}`}
            name='product_code'
            type='text'
            label='Product Code:'
          />

          <SubscribeCheckbox
            isValid={isValid}
            error={errors.subscription}
            control={control}
            className={`${styles['c-user-form__action-section--action-section--checkbox']}`}
            name='subscription'
            label='Get our newsletter'
          />
        </div>

        {/* <p>Complete the form to get your a reusable Star brite Priority Rebate ID. Keep your code handy for future rebates!</p> */}
      </form>

      {isCaptchaVisible && (
        <div className={styles['recaptcha-wrapper']}>
          <ReCaptchaVerifier
            onSuccess={handleCaptchaSuccess}
            onFailure={handleCaptchaFailure}
            isVerifying={isVerifyingCaptcha}
            setIsVerifying={setIsVerifyingCaptcha}
          />
        </div>
      )}
      <Modal isOpen={isModalOpen} modelType={error ? 'error' : 'success'} header={error ? 'Sorry!' : 'Success!'} onClose={handleSuccessModalClose}>
        {confirmationNumber ? (
          <>
            <p className={modalStyles['c-success__rebate']}>
              Your rebate ID is: <span>{confirmationNumber}</span>
            </p>
            <p className={modalStyles['c-success__disclaimer']}>This info was sent to your email, please check your spam folder</p>
          </>
        ) : null}
      </Modal>
    </>
  )
}

export default UserInfoForm

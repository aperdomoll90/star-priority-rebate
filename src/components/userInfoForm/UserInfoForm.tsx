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
import { Checkbox, Input } from '../common/formElements/FormElements'

const initialFormData: Partial<IUserRebateInfoProps> = {
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
  exported: false,
}

const UserInfoForm: React.FC = () => {
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

  useEffect(() => {
    console.log('isFieldsScrollComplete', isFieldsScrollComplete)
  }, [isFieldsScrollComplete])

  const validationRules = createValidationRules(['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country', 'store_name', 'store_city', 'product_code', 'redeem_code'])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleInterestChange = (interest: IInterestTypes) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest) ? prev.interests.filter(i => i !== interest) : [...(prev.interests || []), interest],
    }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setIsCaptchaVisible(true)
  }

  const handleFormSubmit = async () => {
    setError(null)
    setConfirmationNumber(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Submission failed')
        setIsLoading(false)
        return
      }

      const data = await response.json()
      setConfirmationNumber(data.confirmationNumber)
      setIsModalOpen(true)
      setFormData(initialFormData)
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
    handleFormSubmit()
  }

  const handleCaptchaFailure = (message: string) => {
    setError(message)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className={styles['c-user-form']}>
        <UserInfoFields formData={formData} handleInputChange={handleInputChange} handleInterestChange={handleInterestChange} onScrollComplete={handleFieldsScroll} />
        <Button label='Submit' onClick={handleSubmit} className={styles['c-user-form__submit-button']} ariaLabel='Submit rebate form' type='submit' disabled={!isFieldsScrollComplete} />
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

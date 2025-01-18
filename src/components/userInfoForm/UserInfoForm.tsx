'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes'
import Modal from '../common/modal/modal'
import Button from '../common/button/button'
import styles from './UserInfoForm.module.scss'
import modalStyles from '../common/modal/modal.module.scss'
// import Image from 'next/image'

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
  // const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0]
  //     setFormData(prevState => ({ ...prevState, photo: file }))
  //     setPhotoPreview(URL.createObjectURL(file))
  //   }
  // }

  const handleInterestChange = (interest: IInterestTypes) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest) ? prev.interests.filter(i => i !== interest) : [...(prev.interests || []), interest],
    }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setConfirmationNumber(null)

    const submitData = JSON.stringify(formData)

    // Log FormData contents
    console.log('Form data to submit:', submitData)

    try {
      const response = await fetch('/api/submit-rebate-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to application/json
        },
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Submission failed')
        return
      }

      const data = await response.json()
      setConfirmationNumber(data.confirmationNumber)
      setFormData(initialFormData)
      // setPhotoPreview(null);
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor='first_name'>First Name:</label>
          <input type='text' id='first_name' name='first_name' value={formData.first_name || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='last_name'>Last Name:</label>
          <input type='text' id='last_name' name='last_name' value={formData.last_name || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' value={formData.email || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='phone'>Phone:</label>
          <input type='tel' id='phone' name='phone' value={formData.phone || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='address'>Street Address:</label>
          <input type='text' id='address' name='address' value={formData.address || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='address2'>Street Address 2:</label>
          <input type='text' id='address2' name='address2' value={formData.address2 || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='city'>City:</label>
          <input type='text' id='city' name='city' value={formData.city || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='zip'>ZIP:</label>
          <input type='text' id='zip' name='zip' value={formData.zip || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='country'>Country:</label>
          <input type='text' id='country' name='country' value={formData.country || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='state'>State:</label>
          <input type='text' id='state' name='state' value={formData.state || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='store_name'>Store Name:</label>
          <input type='text' id='store_name' name='store_name' value={formData.store_name || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='store_city'>Store City:</label>
          <input type='text' id='store_city' name='store_city' value={formData.store_city || ''} onChange={handleInputChange} />
        </div>
        <div className={`${styles.formGroup} ${styles.interests}`}>
          <p>Interests:</p>
          <div className={styles.checkboxContainer}>
            {Object.values(IInterestTypes).map(interest => (
              <label key={interest}>
                <input type='checkbox' checked={formData.interests?.includes(interest)} onChange={() => handleInterestChange(interest)} />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.subscription}`}>
          <label>
            <input type='checkbox' name='subscription' checked={formData.subscription || false} onChange={handleInputChange} />
            Subscribe to newsletter
          </label>
        </div>
        <div className={`${styles.formGroup} ${styles.comments}`}>
          <label htmlFor='comments1'>Comments:</label>
          <textarea id='comments1' name='comments1' value={formData.comments1 || ''} onChange={handleInputChange}></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='product_code'>Product Code:</label>
          <input type='text' id='product_code' name='product_code' value={formData.product_code || ''} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='redeem_code'>Redeem Code:</label>
          <input type='text' id='redeem_code' name='redeem_code' value={formData.redeem_code || ''} onChange={handleInputChange} />
        </div>

        {/* <div className={styles.formGroup}>
        <label htmlFor='photo'>Receipt Photo:</label>
        <input type='file' id='photo' name='photo' accept='image/*' onChange={handlePhotoChange} />
      </div>
      {photoPreview && (
        <div className={styles.photoPreview}>
          <Image src={photoPreview} alt='Preview' width={200} height={200} />
        </div>
      )} */}

        <Button label='Submit' onClick={handleSubmit} className={styles.submitButton} ariaLabel='Submit rebate form' type='submit' />
      </form>
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
            <p className={modalStyles.success_disclaimer}>This info was sent to your email, please remember to check your spam folder</p>
          </>
        ) : null}
      </Modal>
    </>
  )
}

export default UserInfoForm

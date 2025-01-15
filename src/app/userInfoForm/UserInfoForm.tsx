'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import styles from './UserInfoForm.module.scss'

interface UserInfo {
  name: string
  email: string
  rebateNumber: string
  photo: File | null
}

const UserInfoForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    rebateNumber: '',
    photo: null,
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo(prevState => ({ ...prevState, [name]: value }))
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUserInfo(prevState => ({ ...prevState, photo: file }))
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setConfirmationNumber(null)

    const formData = new FormData()
    formData.append('name', userInfo.name)
    formData.append('email', userInfo.email)
    formData.append('rebateNumber', userInfo.rebateNumber)
    if (userInfo.photo) {
      formData.append('photo', userInfo.photo)
    }

    try {
      const response = await fetch('/api/submit-user-info', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setConfirmationNumber(data.confirmationNumber)
        // Reset form after successful submission
        setUserInfo({
          name: '',
          email: '',
          rebateNumber: '',
          photo: null,
        })
        setPhotoPreview(null)
      } else {
        // Handle error response from server
        setError(data.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('An unexpected error occurred')
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor='name'>Name:</label>
        <input type='text' id='name' name='name' value={userInfo.name} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='email'>Email:</label>
        <input type='email' id='email' name='email' value={userInfo.email} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='rebateNumber'>Rebate Number:</label>
        <input type='text' id='rebateNumber' name='rebateNumber' value={userInfo.rebateNumber} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='photo'>Photo:</label>
        <input type='file' id='photo' name='photo' accept='image/*' onChange={handlePhotoChange} />
      </div>
      {photoPreview && (
        <div className={styles.photoPreview}>
          <Image src={photoPreview} alt='Preview' width={200} height={200} />
        </div>
      )}
      <button type='submit' className={styles.submitButton}>
        Submit
      </button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {confirmationNumber && (
        <div className={styles.confirmation}>
          <p>Your confirmation number is: {confirmationNumber}</p>
        </div>
      )}
    </form>
  )
}

export default UserInfoForm

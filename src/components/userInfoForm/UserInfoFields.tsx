'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes'
import styles from './UserInfoForm.module.scss'
import { Checkbox, CheckboxImage, Input, TextArea } from '../common/formElements/FormElements'

interface UserInfoFieldsProps {
  formData: Partial<IUserRebateInfoProps>
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleInterestChange: (interest: IInterestTypes) => void
  onScrollComplete: (isComplete: boolean) => void
}

const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ formData, handleInputChange, handleInterestChange, onScrollComplete }) => {
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [isScrollComplete, setIsScrollComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current
        if (scrollHeight - scrollTop <= clientHeight + 2 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
          setIsScrollComplete(true)
          onScrollComplete(true)
        } else {
          setIsScrollComplete(false)
          onScrollComplete(false)
        }
      }
    }

    const scrollableElement = scrollableRef.current
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [onScrollComplete])

  return (
    <div ref={scrollableRef} className={styles['c-user-form__input-container']}>
      <Input id='first_name' className='w-50' name='first_name' type='text' label='First Name:' value={formData.first_name || ''} onChange={handleInputChange} required />
      <Input id='last_name' className='w-50' name='last_name' type='text' label='Last Name:' value={formData.last_name || ''} onChange={handleInputChange} required />
      <Input id='email' className='w-50' name='email' type='email' label='Email:' value={formData.email || ''} onChange={handleInputChange} required />
      <Input id='phone' className='w-50' name='phone' type='tel' label='Phone:' value={formData.phone || ''} onChange={handleInputChange} required />
      <Input id='address' className='w-100' name='address' type='text' label='Street Address:' value={formData.address || ''} onChange={handleInputChange} required />
      <Input id='address2' className='w-100' name='address2' type='text' label='Street Address 2:' value={formData.address2 || ''} onChange={handleInputChange} />
      <Input id='city' className='w-40' name='city' type='text' label='City:' value={formData.city || ''} onChange={handleInputChange} required />
      <Input id='state' className='w-20' name='state' type='text' label='State:' value={formData.state || ''} onChange={handleInputChange} required />
      <Input id='zip' className='w-20' name='zip' type='text' label='ZIP:' value={formData.zip || ''} onChange={handleInputChange} required />
      <Input id='country' className='w-20' name='country' type='text' label='Country:' value={formData.country || ''} onChange={handleInputChange} required />
      <Input id='store_name' className='w-20' name='store_name' type='text' label='Store Name:' value={formData.store_name || ''} onChange={handleInputChange} required />
      <Input id='store_city' className='w-20' name='store_city' type='text' label='Store City:' value={formData.store_city || ''} onChange={handleInputChange} required />

      <div className={styles['c-user-form__input-container--interests']}>
        <p>Interests:</p>
        <div className={styles['c-user-form__input-container--interests--checkbox-container']}>
          {Object.values(IInterestTypes).map(interest => (
            <CheckboxImage key={interest} id={interest} name='interests' label={interest} checked={!!formData.interests?.includes(interest)} onChange={() => handleInterestChange(interest)} />
          ))}
        </div>
      </div>

      <TextArea id='comments1' name='comments1' label='Comments:' value={formData.comments1 || ''} onChange={handleInputChange} />
      <Input id='product_code' className={`${styles['c-user-form__input-container--input']} w-50`} name='product_code' type='text' label='Product Code:' value={formData.product_code || ''} onChange={handleInputChange} required />
      <Input id='redeem_code' className={`${styles['c-user-form__input-container--input']} w-50`} name='redeem_code' type='text' label='Redeem Code:' value={formData.redeem_code || ''} onChange={handleInputChange} required />
      <Checkbox id='subscription' className={`${styles['c-user-form__input-container--checkbox']} w-100`} name='subscription' label='Subscribe to newsletter' checked={formData.subscription || false} onChange={handleInputChange} />
    </div>
  )
}

export default UserInfoFields

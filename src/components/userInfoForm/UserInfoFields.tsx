'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes'
import styles from './UserInfoForm.module.scss'
import { Checkbox, CheckboxImage, Input, TextArea } from '../common/formElements/FormElements'
import { Controller } from 'react-hook-form'

interface UserInfoFieldsProps {
  control: any
  errors?: any
  handleImageUpload: (file: File) => void
  onScrollComplete: (isComplete: boolean) => void
}

const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ control, errors, handleImageUpload, onScrollComplete }) => {
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
      <Input className='w-50' control={control} name='first_name' type='text' label='First Name:' error={errors.first_name} required />
      <Input className='w-50' control={control} name='last_name' type='text' label='Last Name:' error={errors.last_name} required />
      <Input className='w-50' control={control} name='email' type='email' label='Email:' error={errors.email} required />
      <Input className='w-50' control={control} name='phone' type='tel' label='Phone:' error={errors.phone} required />
      <Input className='w-100' control={control} name='address' type='text' label='Street Address:' error={errors.address} required />
      <Input className='w-100' control={control} name='address2' type='text' label='Street Address 2:' error={errors.address2} />
      <Input className='w-40' control={control} name='city' type='text' label='City:' error={errors.city} required />
      <Input className='w-20' control={control} name='state' type='text' label='State:' error={errors.state} required />
      <Input className='w-20' control={control} name='zip' type='text' label='ZIP:' error={errors.zip} required />
      <Input className='w-20' control={control} name='country' type='text' label='Country:' error={errors.country} required />
      <Input className='w-20' control={control} name='store_name' type='text' label='Store Name:' error={errors.store_name} required />
      <Input className='w-20' control={control} name='store_city' type='text' label='Store City:' error={errors.store_city} required />

      <div className={styles['c-user-form__input-container--interests']}>
        <p>Interests:</p>
        <div className={styles['c-user-form__input-container--interests--checkbox-container']}>
          {Object.values(IInterestTypes).map(interest => (
            <Controller
              key={interest}
              name='interests'
              control={control}
              render={({ field }) => (
                <CheckboxImage
                  id={interest}
                  name={field.name}
                  label={interest}
                  checked={field.value.includes(interest)}
                  onChange={() => {
                    const updatedInterests = field.value.includes(interest) ? field.value.filter((i: IInterestTypes) => i !== interest) : [...field.value, interest]
                    field.onChange(updatedInterests)
                  }}
                />
              )}
            />
          ))}
        </div>
      </div>

      <Controller
        name='receipt_image'
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <label>
            Receipt Image:
            <input
              type='file'
              accept='image/*'
              id='receipt_image'
              {...field}
              onChange={e => {
                const file = e.target.files?.[0] || null
                onChange(file)
                if (file) {
                  handleImageUpload(file)
                }
              }}
            />
          </label>
        )}
      />

      <TextArea control={control} name='comments1' label='Comments:' error={errors.comments1} />
      <Input error={errors.product_code} control={control} className={`${styles['c-user-form__input-container--input']} w-50`} name='product_code' type='text' label='Product Code:' required />
      <Input error={errors.redeem_code} control={control} className={`${styles['c-user-form__input-container--input']} w-50`} name='redeem_code' type='text' label='Redeem Code:' required />
      <Checkbox error={errors.subscription} control={control} className={`${styles['c-user-form__input-container--checkbox']} w-100`} name='subscription' label='Subscribe to newsletter' />
    </div>
  )
}

export default UserInfoFields

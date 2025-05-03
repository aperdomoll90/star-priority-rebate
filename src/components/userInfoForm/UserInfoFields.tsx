'use client'
import React from 'react'
import { IInterestTypes } from '../../utils/userRebateInfoTypes'
import styles from './UserInfoFields.module.scss'
import { CheckboxImage, Input, InputImage, SubscribeCheckbox, TextArea } from '../common/formElements/FormElements'
import { Controller } from 'react-hook-form'
import { userInfoSchema, UserInfoSchemaType } from './userInfoSchema'

interface UserInfoFieldsProps {
  control: any
  errors?: any
}

const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ control, errors }) => {
  const isFieldRequired = (fieldName: keyof UserInfoSchemaType) => {
    const fieldSchema = userInfoSchema.shape[fieldName]
    return !fieldSchema.isOptional()
  }

  return (
    <div className={styles['c-content-column']}>
      <Input className='w-50' control={control} name='first_name' type='text' label='First Name:' error={errors.first_name} required={isFieldRequired('first_name')} />
      <Input className='w-50' control={control} name='last_name' type='text' label='Last Name:' error={errors.last_name} required={isFieldRequired('last_name')} />
      <Input className='w-50' control={control} name='email' type='email' label='Email:' error={errors.email} required={isFieldRequired('email')} />
      <Input className='w-50' control={control} name='phone' type='tel' label='Phone:' error={errors.phone} required={isFieldRequired('phone')} />
      <Input className='w-100' control={control} name='address' type='text' label='Street Address:' error={errors.address} required={isFieldRequired('address')} />
      <Input className='w-100' control={control} name='address2' type='text' label='Street Address 2:' error={errors.address2} />
      <Input className='w-40' control={control} name='city' type='text' label='City:' error={errors.city} required={isFieldRequired('city')} />
      <Input className='w-20' control={control} name='state' type='text' label='State:' error={errors.state} required={isFieldRequired('state')} />
      <Input className='w-20' control={control} name='zip' type='text' label='ZIP:' error={errors.zip} required={isFieldRequired('zip')} />
      <Input className='w-20' control={control} name='country' type='text' label='Country:' error={errors.country} required={isFieldRequired('country')} />
      <Input className='w-20' control={control} name='store_name' type='text' label='Store Name:' error={errors.store_name} required={isFieldRequired('store_name')} />
      <Input className='w-20' control={control} name='store_city' type='text' label='Store City:' error={errors.store_city} required={isFieldRequired('store_city')} />

      {/* Interests */}
      <div className={styles['c-content-column--interests']}>
        <p>Interests:</p>
        <div className={styles['c-content-column--interests--checkbox-container']}>
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
                  checked={(field.value || []).includes(interest)}
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

      <p>Uploads:</p>
      <div className={styles['c-content-column--grid']}>
        {/* Receipt Image */}
        <InputImage name='receipt_image' className='w-30' control={control} label='Receipt Image' error={errors.receipt_image} />

        {/* Coupon Image */}
        <InputImage name='coupon_image' className='w-30' control={control} label='Coupon Image' error={errors.coupon_image} />

        {/* Barcode Image */}
        <InputImage name='product_barcode_image' className='w-30' control={control} label='Barcode Image' error={errors.product_barcode_image} />
      </div>
      {/* Comments */}
      <TextArea control={control} name='comments1' label='Comments:' error={errors.comments1} />
    </div>
  )
}

export default UserInfoFields

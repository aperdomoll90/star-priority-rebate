import React, { useEffect, useRef, useState } from 'react'
import { CheckboxImageProps, CheckboxInputProps, FormInputProps, InputImageProps, interestImages, TextAreaProps } from './FormElements.types'

import inputStyles from './FormInput.module.scss'
import textAreaStyles from './TextArea.module.scss'
import checkboxStyles from './CheckboxInput.module.scss'
import inputImageStyles from './InputImage.module.scss'

import { IInterestTypes } from '@/utils/userRebateInfoTypes'
import { Controller } from 'react-hook-form'
import { SubscribeSVG } from '../../../../public/SubscribeSVG'
import Button from '../button/button'
const color = '#3f388f'

export const Input: React.FC<FormInputProps> = ({ name, control, label, type, className = '', required = false, error }) => {
  return (
    <div className={`${inputStyles['form-group']} ${className}`}>
      <Controller name={name} control={control} render={({ field }) => <input id={name} {...field} type={type} required={required} placeholder=' ' />} />
      <label htmlFor={name}>{label}</label>
      <span className={inputStyles.error}>{error?.message}</span>
      {error && <span className={inputStyles.error}>{error.message}</span>}
    </div>
  )
}

export const TextArea: React.FC<TextAreaProps> = ({ name, control, label, className = '', required = false, error }) => {
  return (
    <div className={`${textAreaStyles.textAreaContainer} ${className}`}>
      <label htmlFor={name}>{label}</label>
      <Controller name={name} control={control} render={({ field }) => <textarea id={name} {...field} required={required}></textarea>} />
      {error && <span className={textAreaStyles.error}>{error.message}</span>}
    </div>
  )
}

export const SubscribeCheckbox: React.FC<CheckboxInputProps> = ({ name, control, label, className = '', error, isValid }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={`${checkboxStyles['c-subscribe-checkbox-container']} ${className ? className : ''}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <SubscribeSVG isActive={isActive as boolean} />
            <div className={`${checkboxStyles['c-subscribe-checkbox-container__content']} ${className ? className : ''}`}>
              <input
                id={name}
                {...field}
                type='checkbox'
                checked={field.value}
                onChange={e => {
                  field.onChange(e.target.checked)
                  setIsActive(e.target.checked)
                }}
              />
              <label htmlFor={name}>{label}</label>
            </div>
            <Button label='Submit' className={checkboxStyles['c-subscribe-checkbox-container-button']} ariaLabel='Submit rebate form' type='submit' disabled={!isValid} />
          </>
        )}
      />
    </div>
  )
}

export const Checkbox: React.FC<CheckboxInputProps> = ({ name, control, label, className = '', error }) => {
  return (
    <div className={`${checkboxStyles['checkbox-container']} ${className}`}>
      <Controller name={name} control={control} render={({ field }) => <input id={name} {...field} type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />} />
      <label htmlFor={name}>{label}</label>
      {error && <span className={checkboxStyles.error}>{error.message}</span>}
    </div>
  )
}

export const CheckboxImage: React.FC<CheckboxImageProps> = ({ id, name, label, checked, onChange, className = '' }) => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
    onChange()
  }

  return (
    <div className={`${checkboxStyles['checkbox-image-container']} ${className}`} onClick={handleCheckboxChange} data-checked={isChecked}>
      <input type='checkbox' id={id} name={name} checked={isChecked} onChange={handleCheckboxChange} className={checkboxStyles['hidden-checkbox']} />
      <img src={interestImages[label as IInterestTypes]} alt={label} className={checkboxStyles.checkboxImage} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export const InputImage: React.FC<InputImageProps> = ({ name, control, label, className = '', error }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!control._formValues[name]) {
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [control._formValues[name], name])

  return (
    <div className={`${inputImageStyles['c-input-image']} ${className}`}>
      <Controller
        name={name}
        control={control}
        defaultValue=''
        render={({ field: { onChange, value } }) => (
          <>
            <label htmlFor={name} className={inputImageStyles['c-input-image__label']}>
              <div className={inputImageStyles['c-input-image__image-container']}>
                <img src={imagePreview || '/fallback.png'} alt={imagePreview ? `${label} Preview` : 'Fallback'} className={`${inputImageStyles['c-input-image__preview']} ${!imagePreview ? inputImageStyles['c-input-image__preview--fallback'] : ''}`} />
              </div>
              <div className={inputImageStyles['c-input-image__button']}>{imagePreview ? `Change ${label}` : `Upload ${label}`}</div>
            </label>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              id={name}
              className={inputImageStyles['c-input-image__input']}
              onChange={e => {
                const file = e.target.files?.[0] || null
                onChange(file)
                if (file) {
                  const previewUrl = URL.createObjectURL(file)
                  setImagePreview(previewUrl)
                } else {
                  setImagePreview(null)
                }
              }}
            />
          </>
        )}
      />
      {error && <span className={inputImageStyles['c-input-image__error']}>{error.message}</span>}
    </div>
  )
}

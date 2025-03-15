import React, { useEffect, useRef, useState } from 'react'
import { CheckboxImageProps, CheckboxInputProps, FormInputProps, InputImageProps, interestImages, TextAreaProps } from './FormElements.types'

import inputStyles from './FormInput.module.scss'
import textAreaStyles from './TextArea.module.scss'
import checkboxStyles from './CheckboxInput.module.scss'

import { IInterestTypes } from '@/utils/userRebateInfoTypes'
import { Controller } from 'react-hook-form'

export const Input: React.FC<FormInputProps> = ({ name, control, label, type, className = '', required = false, error }) => {
  return (
    <div className={`${inputStyles['form-group']} ${className}`}>
      <label htmlFor={name}>{label}</label>
      <Controller name={name} control={control} render={({ field }) => <input id={name} {...field} type={type} required={required} />} />
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
  const handleClick = () => {
    onChange()
  }

  return (
    <div className={`${checkboxStyles['checkbox-image-container']} ${className}`} onClick={handleClick}>
      <input type='checkbox' id={id} name={name} checked={checked} onChange={onChange} className={checkboxStyles['hidden-checkbox']} />
      <img src={interestImages[label as IInterestTypes]} alt={label} className={`${checkboxStyles.checkboxImage} ${checked ? checkboxStyles.checked : ''}`} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export const InputImage: React.FC<InputImageProps> = ({ 
  name, 
  control, 
  label, 
  className = '', 
  error,
  accept = "image/*",
  maxWidth = '200px',
  maxHeight = '200px'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <div className={`${inputStyles['form-group']} ${className}`}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <div>
            <label htmlFor={name}>{label}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              id={name}
              onChange={(e) => {
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
            {imagePreview && (
              <div>
                <img src={imagePreview} alt={`${label} Preview`} style={{ maxWidth, maxHeight }} />
              </div>
            )}
          </div>
        )}
      />
      {error && <span className={inputStyles.error}>{error.message}</span>}
    </div>
  )
}


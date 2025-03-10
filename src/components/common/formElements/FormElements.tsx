import React from 'react'
import { CheckboxImageProps, CheckboxInputProps, FormInputProps, interestImages, TextAreaProps } from './FormElements.types'

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

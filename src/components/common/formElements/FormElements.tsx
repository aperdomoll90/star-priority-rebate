import React from 'react'
import { CheckboxInputProps, FormInputProps, interestImages, TextAreaProps } from './FormElements.types'

import inputStyles from './FormInput.module.scss'
import textAreaStyles from './TextArea.module.scss'
import checkboxStyles from './CheckboxInput.module.scss'

import { IInterestTypes } from '@/utils/userRebateInfoTypes'

export const Input: React.FC<FormInputProps> = ({ id, name, type, label, value, onChange, required = false, className = '' }) => {
  return (
    <div className={`${inputStyles['form-group']} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} />
    </div>
  )
}

export const TextArea: React.FC<TextAreaProps> = ({ id, name, label, value, onChange, required = false, className = '' }) => {
  return (
    <div className={`${textAreaStyles.textAreaContainer} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} value={value} onChange={onChange} required={required}></textarea>
    </div>
  )
}

export const Checkbox: React.FC<CheckboxInputProps> = ({ id, name, label, checked, onChange, className = '' }) => {
  return (
    <div className={`${checkboxStyles['checkbox-container']} ${className}`}>
      <input id={id} name={name} type='checkbox' checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export const CheckboxImage: React.FC<CheckboxInputProps> = ({ id, name, label, checked, onChange, className = '' }) => {
  const handleClick = () => {
    onChange({ target: { name, checked: !checked } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={`${checkboxStyles['checkbox-image-container']} ${className}`} onClick={handleClick}>
      <input type='checkbox' id={id} name={name} checked={checked} onChange={onChange} className={checkboxStyles['hidden-checkbox']} />

      <img src={interestImages[label as IInterestTypes]} alt={label} className={`${checkboxStyles.checkboxImage} ${checked ? checkboxStyles.checked : ''}`} />

      <label htmlFor={id}>{label}</label>
    </div>
  )
}

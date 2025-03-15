import React, { useEffect, useRef, useState } from 'react'
import { CheckboxImageProps, CheckboxInputProps, FormInputProps, InputImageProps, interestImages, TextAreaProps } from './FormElements.types'

import inputStyles from './FormInput.module.scss'
import textAreaStyles from './TextArea.module.scss'
import checkboxStyles from './CheckboxInput.module.scss'
import inputImageStyles from './InputImage.module.scss'

import { IInterestTypes } from '@/utils/userRebateInfoTypes'
import { Controller } from 'react-hook-form'
const color = '#3f388f'

const SubscriveSVG = () => {
  return (
    <svg width='100%' height='109' viewBox='0 0 400 109' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {/* Left Line */}
      <g className={checkboxStyles['left-line']} id='leftLineGroup' transform='translate(80,10) scale(0.8)'>
        <path d='M0,54.5 H10 M20,54.5 H35 M45,54.5 H115 M125,54.5 H135 M145,54.5 H147 M157,54.5 H167' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
      </g>

      {/* Bottom Left Line */}
      <g className={checkboxStyles['right-line']} id='rightLineGroup' transform='translate(40, 25) scale(0.8)'>
        <path d='M0,54.5 H10 M20,54.5 H35 M45,54.5 H115 M125,54.5 H135 M145,54.5 H147 M157,54.5 H167' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
      </g>

      {/* Envelope - centered */}
      <g className={checkboxStyles['envelope']} id='envelopeGroup' transform='translate(230, 25) scale(0.55)'>
        <path d='M9.5 3H154C157.5 3.2124 160 5.7124 160.5 8C160.72 9.00756 160.5 11.7744 160.5 15.7345V97.0001C160.5 99.2124 160.696 102.491 157.689 104.473C156.29 105.395 154.295 106 151.5 106H9.5C8.43328 106.082 6.84139 105.744 5.5 104.473C4.11682 103.162 3 100.858 3 97.0001V15.0001V8C3 6.33333 4.3 3 9.5 3Z' />
        <path
          d='M3 15.0001C3 43.13 3 90.0192 3 97.0001C3 100.858 4.11682 103.162 5.5 104.473M3 15.0001C3 12.5056 3 10.1586 3 8C3 6.33333 4.3 3 9.5 3H154C157.5 3.2124 160 5.7124 160.5 8C160.72 9.00756 160.5 11.7744 160.5 15.7345M3 15.0001L57 56.8776M160.5 15.7345C160.5 33.2769 160.5 74.7007 160.5 97.0001C160.5 99.2124 160.696 102.491 157.689 104.473M160.5 15.7345C146.336 26.4383 123.039 44.1284 106.531 56.8776M5.5 104.473C6.84139 105.744 8.43328 106.082 9.5 106C53.1667 106 142.7 106 151.5 106C154.295 106 156.29 105.395 157.689 104.473M5.5 104.473L57 56.8776M57 56.8776L76 71.7124C82 75.7124 82 75.7124 88 71.7124C88.4858 71.3886 96.4274 64.6809 106.531 56.8776M106.531 56.8776L157.689 104.473'
          stroke='#3a3939'
          stroke-width='5'
        />
      </g>

        {/* Right Top Line */}
        <g className={checkboxStyles['right-line']} id='rightLineGroup' transform='translate(250, 0) scale(0.8)'>
        <path d='M400,54.5 H390 M380,54.5 H365 M355,54.5 H285 M275,54.5 H265 M255,54.5 H253 M243,54.5 H233' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
      </g>
      
      {/* Right Line */}
      <g className={checkboxStyles['right-line']} id='rightLineGroup' transform='translate(150, 15) scale(0.8)'>
        <path d='M400,54.5 H390 M380,54.5 H365 M355,54.5 H285 M275,54.5 H265 M255,54.5 H253 M243,54.5 H233' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
      </g>
    </svg>
  )
}

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

export const SubscribeCheckbox: React.FC<CheckboxInputProps> = ({ name, control, label, className = '', error }) => {
  return (
    <div className={`${checkboxStyles['c-subscribe-checkbox-container']} ${className}`}>
      <SubscriveSVG />
      <div className={`${checkboxStyles['c-subscribe-checkbox-container__content']} ${className}`}>
        <Controller name={name} control={control} render={({ field }) => <input id={name} {...field} type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />} />
        <label htmlFor={name}>{label}</label>
        {error && <span className={checkboxStyles.error}>{error.message}</span>}
      </div>
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


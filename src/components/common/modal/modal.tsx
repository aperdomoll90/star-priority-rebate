'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './modal.module.scss'
import Button from '../button/button'
import { CheckmarkIcon, CloseIcon } from '../../../../public/iconCollection'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  header: string
  content?: string
  children?: React.ReactNode
  modelType: 'error' | 'success'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, header, content, modelType }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current || e.key !== 'Tab') return
    const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }, [])

  const closeModal = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement
      window.addEventListener('keydown', closeModal)
      window.addEventListener('keydown', trapFocus)

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>
      const firstFocusableElement = focusableElements.length > 0 ? focusableElements[0] : null
      ;(firstFocusableElement as HTMLElement)?.focus()

      document.body.setAttribute('aria-hidden', 'true')
    } else {
      window.removeEventListener('keydown', closeModal)
      window.removeEventListener('keydown', trapFocus)
      lastFocusedElementRef.current?.focus()
      document.body.removeAttribute('aria-hidden')
    }

    return () => {
      window.removeEventListener('keydown', closeModal)
      window.removeEventListener('keydown', trapFocus)
      document.body.removeAttribute('aria-hidden')
    }
  }, [isOpen, closeModal, trapFocus])

  if (!isOpen) return null

  return (
    <div className={styles['c-overlay']} role='dialog' aria-modal='true'>
      <div className={styles['c-modal']} ref={modalRef} data-model-type={modelType}>
        <div className={styles['c-modal__sign']}>{modelType === 'error' ? <CloseIcon color='#fff' /> : <CheckmarkIcon color='#fff' />}</div>
        <h3 className={styles['c-modal__header']}>{header}</h3>
        <p className={styles['c-modal__content']}>{content ? content : children}</p>
        <Button type='button' className={styles['c-modal__close']} label={modelType === 'error' ? 'Try Again' : 'Continue'} onClick={onClose} ariaLabel='Submit rebate form' />
      </div>
    </div>
  )
}

export default Modal

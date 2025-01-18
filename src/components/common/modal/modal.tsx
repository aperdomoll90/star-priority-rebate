'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './modal.module.scss'
import Button from '../button/button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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

      const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>
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
    <div className={styles.overlay} role='dialog' aria-modal='true'>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modal__content}>{children}</div>
        <Button type='button' className={styles.modal__close} label='Close' onClick={onClose} ariaLabel='Submit rebate form' />
      </div>
    </div>
  )
}

export default Modal

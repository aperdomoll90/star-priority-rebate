import React from 'react'
import styles from './button.module.scss'

interface ButtonProps {
  label: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  ariaLabel: string
  disabled?: boolean
  iconPrev?: React.ReactNode
  iconPost?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, ariaLabel, disabled = false, type = 'button', iconPrev, iconPost }) => {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick ? e => onClick(e) : undefined} aria-label={ariaLabel} disabled={disabled} tabIndex={0} type={type}>
      {iconPrev} {label} {iconPost}
    </button>
  )
}

export default Button

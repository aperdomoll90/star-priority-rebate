'use client'

import { useState } from 'react'
import styles from './AdminLoginPage.module.scss'
import modalStyles from '../../components/common/modal/modal.module.scss'
import AdminPortal from '@/components/adminPortal/AdminPortal'
import Button from '@/components/common/button/button'
import Modal from '@/components/common/modal/modal'
import { createValidationRules, useFormValidation } from '@/utils/useFormValidation'
import Loader from '@/components/common/loader/loader'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loginValidationRules = createValidationRules(['username', 'password'])

  const { values, errors, handleChange, validateForm } = useFormValidation({ username: '', password: '' }, loginValidationRules)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading using a timer
    setTimeout(() => {
      setIsLoggedIn(true)
      setIsLoading(false)
    }, 2000) // 2-second delay for the loader
  }

  if (isLoggedIn) {
    return <AdminPortal />
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.loginContainer}>
        <h1 className={styles.loginHeader}>Admin Login</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div>
            <input type='text' name='username' value={values.username} onChange={handleChange} placeholder='Username' />
            {errors.username && <span className={styles.error}>{errors.username}</span>}
          </div>
          <div>
            <input type='password' name='password' value={values.password} onChange={handleChange} placeholder='Password' />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          <Button label='Login' onClick={handleLogin} className={styles.loginButton} ariaLabel='Admin Login form' type='submit' />
        </form>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className={modalStyles.error_header}>Sorry!!</h3>
        <p className={modalStyles.error_message}>Invalid credentials</p>
      </Modal>
    </>
  )
}

'use client'

import { useState } from 'react'
import styles from './AdminLoginPage.module.scss'
import modalStyles from '../../components/common/modal/modal.module.scss'
import AdminPortal from '@/components/adminPortal/AdminPortal'
import Button from '@/components/common/button/button'
import Modal from '@/components/common/modal/modal'
import { createValidationRules, useFormValidation } from '@/utils/useFormValidation'
import Loader from '@/components/common/loader/loader'
import ReCaptchaVerifier from '@/utils/ReCaptchaVerifier'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalMessage, setModalMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCaptchaVisible, setIsCaptchaVisible] = useState<boolean>(false)
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState<boolean>(false)

  const loginValidationRules = createValidationRules(['username', 'password'])

  const { values, errors, handleChange } = useFormValidation({ username: '', password: '' }, loginValidationRules)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    if (values.username === 'a' && values.password === 'a') {
      setIsCaptchaVisible(true)
      setIsLoading(false)
    } else {
      setModalMessage('Invalid credentials, please try again.')
      setIsModalOpen(true)
      setIsLoading(false)
    }
  }

  const handleCaptchaSuccess = () => {
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 2000)
  }

  const handleCaptchaFailure = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  if (isLoggedIn) {
    return <AdminPortal />
  }

  return (
    <>
      {(isLoading || isVerifyingCaptcha) && <Loader />}
      <div className={styles.loginContainer}>
        <h1 className={styles.loginHeader}>Admin Login</h1>

        {!isCaptchaVisible && (
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div>
              <input type='text' name='username' value={values.username} onChange={handleChange} placeholder='Username' />
              {errors.username && <span className={styles.error}>{errors.username}</span>}
            </div>
            <div>
              <input type='password' name='password' value={values.password} onChange={handleChange} placeholder='Password' />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>
            <Button type='submit' label='Next' onClick={handleLogin} className={styles.loginButton} ariaLabel='Verify Login' />
          </form>
        )}

        {isCaptchaVisible && <ReCaptchaVerifier onSuccess={handleCaptchaSuccess} onFailure={handleCaptchaFailure} isVerifying={isVerifyingCaptcha} setIsVerifying={setIsVerifyingCaptcha} />}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className={modalStyles.error_header}>Oops!</h3>
        <p className={modalStyles.error_message}>{modalMessage}</p>
      </Modal>
    </>
  )
}

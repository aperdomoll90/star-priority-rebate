'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './AdminLoginPage.module.scss'
import modalStyles from '../../components/common/modal/modal.module.scss'
import AdminPortal from '@/components/adminPortal/AdminPortal'
import Button from '@/components/common/button/button'
import Modal from '@/components/common/modal/modal'
import Loader from '@/components/common/loader/loader'
import ReCaptchaVerifier from '@/utils/ReCaptchaVerifier'

// Define the schema for form validation
// const loginSchema = z.object({
//   username: z.string().min(1, 'Username is required'),
//   password: z.string().min(1, 'Password is required'),
// })
const loginSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVisible, setIsCaptchaVisible] = useState(false)
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    if (!data.username || !data.password) {
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
          <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
            <div>
              <input type='text' {...register('username')} placeholder='Username' />
              {errors.username && <span className={styles.error}>{errors.username.message}</span>}
            </div>
            <div>
              <input type='password' {...register('password')} placeholder='Password' />
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
            <Button type='submit' label='Next' className={styles.loginButton} ariaLabel='Verify Login' />
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

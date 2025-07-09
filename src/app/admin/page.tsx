'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './AdminLoginPage.module.scss'
import modalStyles from '../../components/common/modal/modal.module.scss'
import Button from '@/components/common/button/button'
import Modal from '@/components/common/modal/modal'
import Loader from '@/components/common/loader/loader'
import ReCaptchaVerifier from '@/utils/ReCaptchaVerifier'
import { Constellations } from '../../../public/Constellations'
import { Input } from '@/components/common/formElements/FormElements'
import { TriangularMesh } from '../../../public/TriangularMesh'

// Define the schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVisible, setIsCaptchaVisible] = useState(false)
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    const res = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    })

    if (res?.ok) {
      setIsCaptchaVisible(true)
      setIsLoading(false)
    } else {
      setModalMessage('Invalid credentials, please try again.')
      setIsModalOpen(true)
      setIsLoading(false)
    }
  }

  const handleCaptchaSuccess = () => {
    setIsLoading(true)
    router.push('/adminportal')
  }

  const handleCaptchaFailure = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  return (
    <>
      {(isLoading || isVerifyingCaptcha) && <Loader />}
      <div className={styles['c-admin-login']}>
        <TriangularMesh className={styles['c-admin-login__mesh']} />

        <div className={styles['c-admin-login__banner']}>
          <Constellations className={styles['c-admin-login__banner--constellation']} />

          <h1 className={styles['c-admin-login__banner--title']}>Admin Login</h1>

          {!isCaptchaVisible && (
            <form onSubmit={handleSubmit(onSubmit)} className={styles['c-admin-login__banner--form']}>
              <Input
                className={`${styles['c-admin-login__banner--form--input']}`}
                control={control}
                name='username'
                type='text'
                label='Username'
                error={errors.username}
                required
              />

              <Input
                className={`${styles['c-admin-login__banner--form--input']}`}
                control={control}
                name='password'
                type='password'
                label='Password'
                error={errors.password}
                required
              />
              <Button type='submit' label='Next' className={styles['c-admin-login__banner--form--button']} ariaLabel='Verify Login' />
            </form>
          )}
        </div>
      </div>

      {isCaptchaVisible && (
        <div className={styles['c-recaptcha-wrapper']}>
          <ReCaptchaVerifier
            onSuccess={handleCaptchaSuccess}
            onFailure={handleCaptchaFailure}
            isVerifying={isVerifyingCaptcha}
            setIsVerifying={setIsVerifyingCaptcha}
          />
        </div>
      )}

      <Modal header='Oops!' content={modalMessage} modelType='error' isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

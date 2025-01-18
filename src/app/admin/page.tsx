'use client'

import { useState } from 'react'
import styles from './AdminLoginPage.module.scss'
import modalStyles from '../../components/common/modal/modal.module.scss'
import AdminPortal from '@/components/adminPortal/AdminPortal'
import Button from '@/components/common/button/button'
import Modal from '@/components/common/modal/modal'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your authentication logic here
    // For demonstration, we're using a simple check
    if (username === '' && password === '') {
      setIsLoggedIn(true)
    } else {
      setIsModalOpen(true)
    }
  }

  if (isLoggedIn) {
    return <AdminPortal />
  }

  return (
    <>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginHeader}>Admin Login</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' required />
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' required />
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

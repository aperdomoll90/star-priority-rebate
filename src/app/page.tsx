import Image from 'next/image'
import styles from './page.module.css'
import UserInfoForm from './userInfoForm/UserInfoForm'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UserInfoForm />
      </main>
    </div>
  )
}

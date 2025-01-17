import Image from 'next/image'
import styles from './page.module.css'
import UserInfoForm from './userInfoForm/UserInfoForm'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Priority Rebate Form</h1>
        <p>Complete the form to get your a reusable Star brite Priority Rebate ID. Keep your code handy for future rebates!</p>
        <UserInfoForm />
        <p style={{ alignSelf: 'center' }}>v scroll v</p>
      </main>
    </div>
  )
}

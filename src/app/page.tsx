import styles from './page.module.scss'
import UserInfoForm from '../components/userInfoForm/UserInfoForm'

export default function Home() {
  return (
    
      <main className={styles.main}>
        <h1>Priority Rebate Form</h1>
        <p>Complete the form to get your a reusable Star brite Priority Rebate ID. Keep your code handy for future rebates!</p>
        <UserInfoForm />
        <p style={{ alignSelf: 'center' }}>v scroll v</p>
      </main>
  )
}

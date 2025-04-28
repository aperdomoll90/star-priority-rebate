import styles from './page.module.scss'
import UserInfoForm from '../components/userInfoForm/UserInfoForm'

export default function Home() {
  return (
    <main className={styles['c-main']}>
      <div className={`${styles['c-main__content-column']}`}>
        <UserInfoForm />
      </div>
      <div className={styles['c-main__banner']}>
        <h1>StarPriority</h1>
        <h4>Priority Rebate Form</h4>
        {/* <p>Complete the form to get your a reusable Star brite Priority Rebate ID. Keep your code handy for future rebates!</p> */}
      </div>
    </main>
  )
}

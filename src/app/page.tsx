import styles from './page.module.scss'
import UserInfoForm from '../components/userInfoForm/UserInfoForm'

export default function Home() {
  return (
    <main className={styles['c-main']}>
     <UserInfoForm />
    </main>
  )
}

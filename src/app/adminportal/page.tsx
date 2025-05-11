import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AdminPortalClient from './AdminPortalClient'

export default async function AdminPortalPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin')
  }

  return <AdminPortalClient />
}

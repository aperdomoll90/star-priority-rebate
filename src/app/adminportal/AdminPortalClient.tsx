'use client'
import { useState, useEffect } from 'react'
import styles from './AdminPortal.module.scss'
import Button from '../../components/common/button/button'
import { IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { generateCSV, downloadCSV } from '@/utils/csvHandler'
import Loader from '../../components/common/loader/loader'
import { Constellations } from '../../../public/Constellations'
import { DownloadIcon } from '../../../public/iconCollection'
import { SubmissionCard } from '@/components/common/submitionCard/SubmissionCardProps'

export default function AdminPortalClient() {
  const [rebates, setRebates] = useState<IUserRebateInfoProps[]>([])
  const [seeAll, setSeeAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRebates()
  }, [seeAll])

  const fetchRebates = async () => {
    try {
      const endpoint = seeAll ? '/api/rebates/' : '/api/rebates/unexported'
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error('Failed to fetch rebates')
      }
      const data = await response.json()
      setRebates(data)
    } catch (error) {
      console.error('Error fetching rebates:', error)
    }
  }

  const updateExportedStatus = async (rebates: IUserRebateInfoProps[]) => {
    try {
      const response = await fetch('/api/rebates/update-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rebates }),
      })
      if (!response.ok) {
        throw new Error('Failed to update exported status')
      }
      await fetchRebates()
    } catch (error) {
      console.error('Error updating exported status:', error)
    }
  }

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      if (rebates.length > 0) {
        const csvContent = generateCSV(rebates)
        downloadCSV(csvContent, 'rebates.csv')

        if (!seeAll) {
          await fetch('/api/send-rebate-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rebates }),
          })
          await updateExportedStatus(rebates)
        }
      }
    } catch (error) {
      console.error('Error during download process:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles['c-admin-portal']} data-new-rebates={!seeAll}>
        <div className={styles['c-admin-portal__toggle']}>
          <input type='checkbox' id='c-admin-portal__toggle' checked={seeAll} onChange={() => setSeeAll(prev => !prev)} hidden />
          <label htmlFor='c-admin-portal__toggle'>
            <span></span>
          </label>
        </div>

        <div className={styles['c-admin-portal__banner']}>
          <Constellations className={styles['c-admin-portal__banner--constellation']} />

          <div className={styles['c-admin-portal__banner--title']}>
            <h1>StarPriority</h1>
            <h4>Rebate Admin Portal</h4>
          </div>

          <Button
            iconPrev={<DownloadIcon color={rebates.length === 0 ? '#3498db' : '#fff'} />}
            label='Download'
            onClick={handleDownload}
            className={styles['c-admin-portal__banner--download']}
            ariaLabel='Download rebates'
            disabled={rebates.length === 0}
          />
          <div className={styles['c-admin-portal__banner--background']} />
        </div>

        <div className={styles['c-admin-portal__content']}>
          <ul className={styles['c-admin-portal__content--list']} data-empty={rebates.length === 0}>
            {rebates.length > 0 ? (
              rebates.map(rebate => <SubmissionCard key={rebate.redeem_code} rebate={rebate} />)
            ) : (
              <div className={styles['c-admin-portal__content--list']}> No rebates to display</div>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

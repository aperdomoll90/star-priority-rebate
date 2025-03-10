'use client'
import { useState, useEffect } from 'react'
import styles from './AdminPortal.module.scss'
import Button from '../../components/common/button/button'
import { IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { generateCSV, downloadCSV } from '@/utils/csvHandler'
import Loader from '../../components/common/loader/loader'
import Image from 'next/image'

export default function AdminPortal() {
  const [rebates, setRebates] = useState<IUserRebateInfoProps[]>([])
  const [seeAll, setSeeAll] = useState(false)
  const [seeNewRebates, setSeeNewRebates] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRebates()
  }, [seeAll, seeNewRebates])

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
        await updateExportedStatus(rebates)
      }
    } catch (error) {
      console.error('Error during download process:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeeAllChange = () => {
    setSeeAll(!seeAll)
    setSeeNewRebates(false)
  }

  const handleSeeNewRebatesChange = () => {
    setSeeNewRebates(!seeNewRebates)
    setSeeAll(false)
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.adminContainer}>
        <h1>Admin Portal</h1>
        <div className={styles.filterOptions}>
          <label>
            <input type='checkbox' checked={seeAll} onChange={handleSeeAllChange} />
            See All
          </label>
          <label>
            <input type='checkbox' checked={seeNewRebates} onChange={handleSeeNewRebatesChange} />
            See New Rebates
          </label>
        </div>
        <div className={styles.rebateList} style={{ justifyContent: rebates.length === 0 ? 'center' : 'flex-start', alignItems: rebates.length === 0 ? 'center' : 'flex-start' }}>
          {rebates.length > 0 ? (
            rebates.map(rebate => (
              <div key={rebate.user_id} className={styles.rebateItem}>
                <span>
                  {rebate.first_name} {rebate.last_name}
                </span>
                <span>ID: {rebate.user_id}</span>
                <Image src={rebate.receipt_image as string} alt='Receipt Image' width={200} height={200} className={styles.image} />
              </div>
            ))
          ) : (
            <div>No rebates to display</div>
          )}
        </div>
        <Button label='Download' onClick={handleDownload} className={styles.downloadButton} ariaLabel='Download rebates' disabled={rebates.length === 0} />
      </div>
    </>
  )
}

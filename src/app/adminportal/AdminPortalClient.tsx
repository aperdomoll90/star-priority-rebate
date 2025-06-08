'use client'
import { useState, useEffect } from 'react'
import styles from './AdminPortal.module.scss'
import Button from '../../components/common/button/button'
import { IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'
import { generateCSV, downloadCSV } from '@/utils/csvHandler'
import Loader from '../../components/common/loader/loader'
import Image from 'next/image'
import { Constellations } from '../../../public/Constellations'
import { DownloadSVG } from '../../../public/DownloadSVG'

export default function AdminPortalClient() {
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
      <div className={styles['c-admin-portal']}>
        <div className={styles['c-admin-portal__banner']}>
          <Constellations className={styles['c-admin-portal__banner--constellation']} />
          <div className={styles['c-admin-portal__banner--title']}>
            <h1>StarPriority</h1>
            <h4>Rebate Admin Portal</h4>
          </div>
          <div className={styles['c-admin-portal__banner--toggle']}>
            <label>
              <input type='checkbox' checked={seeAll} onChange={handleSeeAllChange} />
              See All
            </label>
            <label>
              <input type='checkbox' checked={seeNewRebates} onChange={handleSeeNewRebatesChange} />
              See New Rebates
            </label>
          </div>
        </div>

        <div className={styles['c-admin-portal__content']}>
          <div className={styles['c-admin-portal__content--list']}>
            {rebates.length > 0 ? (
              rebates.map(rebate => (
                <div key={rebate.redeem_code} className={styles['c-admin-portal__content--list--item']}>
                  <span>
                    {rebate.first_name} {rebate.last_name}
                  </span>
                  <span>ID: {rebate.redeem_code}</span>
                  <Image src={rebate.receipt_image as string} alt='Receipt Image' width={200} height={200} className={styles['c-admin-portal__content--list--item-image']} />
                </div>
              ))
            ) : (
              <div>No rebates to display</div>
            )}
          </div>

          <Button iconPrev={<DownloadSVG />} label='Download' onClick={handleDownload} className={styles['c-admin-portal__content--download']} ariaLabel='Download rebates' disabled={rebates.length === 0} />
        </div>
      </div>
    </>
  )
}

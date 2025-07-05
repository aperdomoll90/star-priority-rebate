'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './SubmissionCard.module.scss'
import { UserIcon } from '../../../../public/iconCollection'
import { IUserRebateInfoProps } from '@/utils/userRebateInfoTypes'

interface SubmissionCardProps {
  rebate: IUserRebateInfoProps
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ rebate }) => {
  return (
    <li key={rebate.redeem_code} className={styles['c-submission-card']}>
      <UserIcon className={styles['c-submission-card__image']} aria-hidden='true' />

      <div className={styles['c-submission-card__content']}>
        <h3 className={styles['c-submission-card__content--title']}>
          {rebate.first_name} {rebate.last_name}
        </h3>

        <p className={styles['c-submission-card__content--email']}>{rebate.email}</p>
        <p className={styles['c-submission-card__content--location']}>{`${rebate.country}, ${rebate.state}`}</p>

        <div className={styles['c-submission-card__content--codes']}>
          <p>
            <strong> ID: </strong>
            {rebate.redeem_code}
          </p>
          <p>
            <strong> Product: </strong>
            {rebate.product_code}
          </p>
        </div>
      </div>
    </li>
  )
}

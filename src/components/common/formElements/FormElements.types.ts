import { IInterestTypes } from '@/utils/userRebateInfoTypes'
import { ChangeEvent } from 'react'


export interface FormInputProps {
  id: string
  name: string
  type: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
}

export interface TextAreaProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
}

export interface CheckboxInputProps {
  id: string
  name: string
  label: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}


export const interestImages: Record<IInterestTypes, string> = {
  [IInterestTypes.automotive]: '/automobile.png',
  [IInterestTypes.home_care]: '/homecare.png',
  [IInterestTypes.freshwater_boating]: '/freshwater.png',
  [IInterestTypes.saltwater_boating]: '/saltwater.png',
  [IInterestTypes.paddlesports]: '/paddlesports.png',
  [IInterestTypes.powersports_motorcycle]: '/motorcycle.png',
  [IInterestTypes.small_engine_power_equipment]: '/smallengine.png',
  [IInterestTypes.rvs]: '/rv.png',
  [IInterestTypes.send_me_everything]: '/all.png',
}


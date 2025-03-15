import { IInterestTypes } from '@/utils/userRebateInfoTypes'
import { ChangeEvent } from 'react'
import { Control, FieldError } from 'react-hook-form';


export interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  type: string;
  className?: string;
  required?: boolean;
  error?: FieldError;
}

export interface TextAreaProps {
  name: string;
  control: Control<any>;
  label: string;
  className?: string;
  required?: boolean;
  error?: FieldError;
}

export interface CheckboxInputProps {
  name: string;
  control: Control<any>;
  label: string;
  className?: string;
  checked?: boolean;
  error?: FieldError;
}

export interface CheckboxImageProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export interface InputImageProps {
  name: string;
  control: any;
  label: string;
  className?: string;
  error?: any;
  accept?: string;
  maxWidth?: string;
  maxHeight?: string;
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


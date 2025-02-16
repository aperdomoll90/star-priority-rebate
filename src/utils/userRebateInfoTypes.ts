export enum IInterestTypes {
  automotive = 'Automotive',
  home_care = 'Home Care',
  freshwater_boating = 'Freshwater Boating',
  saltwater_boating = 'Saltwater Boating',
  paddlesports = 'Paddlesports',
  powersports_motorcycle = 'Powersports / Motorcycle',
  small_engine_power_equipment = 'Small Engine / Power Equipment',
  rvs = "RV's",
  send_me_everything = 'Send Me Everything!',
}

export interface IUserRebateInfoProps {
  first_name?: string
  last_name?: string
  address?: string
  address2?: string
  city?: string
  zip?: string
  country?: string
  state?: string
  email?: string
  phone?: string
  store_name?: string
  store_city?: string
  comments1?: string
  interests?: IInterestTypes[]
  subscription?: boolean
  product_code?: string
  redeem_code?: string
  receipt_image?: string
  coupon_image?: string
  product_barcode_image?: string
  date_added?: Date
  exported?: boolean
}



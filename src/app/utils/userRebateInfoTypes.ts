export enum IInterestTypes {
  automotive = 'AUTOMOTIVE',
  home_care = 'HOME CARE',
  freshwater_boating = 'FRESHWATER BOATING',
  saltwater_boating = 'SALTWATER BOATING',
  paddlesports = 'PADDLESPORTS',
  powersports_motorcycle = 'POWERSPORTS / MOTORCYCLE',
  small_engine_power_equipment = 'SMALL ENGINE / POWER EQUIPMENT',
  rvs = "RV'S",
  send_me_everything = 'SEND ME EVERYTHING!',
}

export interface IUserRebateInfoProps {
    first_name?: string;
    last_name?: string;
    address?: string;
    address2?: string;
    city?: string;
    zip?: string;
    country?: string;
    state?: string;
    email?: string;
    phone?: string;
    store_name?: string;
    store_city?: string;
    comments1?: string;
    interests?: IInterestTypes[];
    subscription?: boolean;
    product_code?: string;
    redeem_code?: string;
    receipt_image?: string;
    coupon_image?: string;
    product_barcode_image?: string;
    date_added?: Date; 
    exported?: boolean; 
  }
  
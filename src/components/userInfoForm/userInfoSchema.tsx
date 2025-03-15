import { z } from 'zod';
import { IInterestTypes } from '../../utils/userRebateInfoTypes';

export const userInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  store_name: z.string().optional(),
  store_city: z.string().optional(),
  interests: z.array(z.nativeEnum(IInterestTypes)).optional(),
  comments1: z.string().optional(),
  product_code: z.string().min(1, "Product code is required"),
  redeem_code: z.string().min(1, "Redeem code is required"),
  subscription: z.boolean(),
  receipt_image: z.instanceof(File).optional(),
  coupon_image: z.instanceof(File).optional(),
  product_barcode_image: z.instanceof(File).optional(),
});

export type UserInfoSchemaType = z.infer<typeof userInfoSchema>;

// src/utils/formValidation.ts

import { IUserRebateInfoProps } from "./userRebateInfoTypes"

export const validateForm = (formData: Partial<IUserRebateInfoProps>): string | null => {
  if (!formData.first_name || !formData.last_name || !formData.email) {
    return 'First name, last name, and email are required.'
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    return 'Please enter a valid email address.'
  }

  // Phone number validation (optional)
  if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
    return 'Phone number must be a valid 10-digit number.'
  }

  // ZIP code validation (optional)
  if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
    return 'ZIP code must be a valid format (e.g., 12345 or 12345-6789).'
  }

  return null // No errors
}

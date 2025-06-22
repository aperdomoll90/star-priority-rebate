import { useState } from 'react'

type ValidationRule = (value: string) => string | null

export const createValidationRules = (fields: string[]) => {
  const rules: { [key: string]: (value: string) => string | null } = {};

  fields.forEach(field => {
    switch (field) {
      case 'username':
        rules.username = (value: string) => (value ? null : 'Username is required');
        break;
      case 'password':
        rules.password = (value: string) => {
          if (!value) return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters long';
          return null;
        };
        break;
      case 'first_name':
        rules.first_name = (value: string) => (value ? null : 'First name is required');
        break;
      case 'last_name':
        rules.last_name = (value: string) => (value ? null : 'Last name is required');
        break;
      case 'email':
        rules.email = (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email format');
        break;
      case 'phone':
        rules.phone = (value: string) => (/^\d{10}$/.test(value) ? null : 'Phone number must be 10 digits');
        break;
      case 'address':
        rules.address = (value: string) => (value ? null : 'Address is required');
        break;
      case 'city':
        rules.city = (value: string) => (value ? null : 'City is required');
        break;
      case 'state':
        rules.state = (value: string) => (value ? null : 'State is required');
        break;
      case 'zip':
        rules.zip = (value: string) => (/^\d{5}(-\d{4})?$/.test(value) ? null : 'Invalid ZIP code');
        break;
      case 'country':
        rules.country = (value: string) => (value ? null : 'Country is required');
        break;
      case 'store_name':
        rules.store_name = (value: string) => (value ? null : 'Store name is required');
        break;
      case 'store_city':
        rules.store_city = (value: string) => (value ? null : 'Store city is required');
        break;
      case 'product_code':
        rules.product_code = (value: string) => (value ? null : 'Product code is required');
        break;
    }
  });

  return rules;
};



export const useFormValidation = (initialState: { [key: string]: string }, validationRules: { [key: string]: ValidationRule }) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })

    if (validationRules[name]) {
      const error = validationRules[name](value)
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error || '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    Object.keys(validationRules).forEach(key => {
      const error = validationRules[key](values[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  return { values, errors, handleChange, validateForm }
}

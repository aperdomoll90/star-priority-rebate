import { IAdminPortalProps } from '@/components/adminPortal/AdminPortal'

// export const generateCSV = (data: any[]) => {
//     const headers = Object.keys(data[0]).join(',');
//     const rows = data.map(item => Object.values(item).join(','));
//     return [headers, ...rows].join('\n');
//   };

export const generateCSV = (rebates: IAdminPortalProps[]) => {
  enum rebateFields {
    product_code = 'Product Code',
    redeem_code = 'Redeem Code',
    first_name = 'First Name',
    last_name = 'Last Name',
    address = 'Address',
    address2 = 'Address2',
    city = 'City',
    zip = 'Zip',
    country = 'Country',
    state = 'State',
    email = 'Email',
    phone = 'Phone',
    store_name = 'Store',
    store_city = 'Store City',
    comments1 = 'Comments1',
    subscription = 'Subscription', // Will say "checked" or empty
    interests = 'Interests',
    date_added = 'Date Added',
  }

  const csvColumns = [
    rebateFields.product_code,
    rebateFields.redeem_code,
    rebateFields.first_name,
    rebateFields.last_name,
    rebateFields.address,
    rebateFields.address2,
    rebateFields.city,
    rebateFields.zip,
    rebateFields.country,
    rebateFields.state,
    rebateFields.email,
    rebateFields.phone,
    'Form', // Static value
    rebateFields.store_name,
    rebateFields.store_city,
    'Store Country', // Static value (empty)
    'Store St', // Static value (empty)
    'Purchase Date', // Static value (empty)
    'Postmarkdate', // Static value (empty)
    'Type', // Static value (empty)
    'Size', // Static value (empty)
    'Make', // Static value (empty)
    rebateFields.comments1,
    'Comments2', // Static value (empty)
    rebateFields.subscription,
    rebateFields.interests,
    rebateFields.date_added,
    'Payment Type', // Static value (always "check")
    'Source', // Static value (empty)
  ]

  const csvRows = [csvColumns.join(',')]

  rebates.forEach(rebate => {
    const row = csvColumns.map(column => {
      let value: any = ''

      // Map enum keys to rebate object keys
      const fieldKey = Object.keys(rebateFields).find(
        key => rebateFields[key as keyof typeof rebateFields] === column
      ) as keyof IAdminPortalProps | undefined

      // Get value from the rebate object if the column corresponds to a rebate field
      if (fieldKey) {
        value = rebate[fieldKey]
      }

      // Handle specific cases
      if (column === 'Form') {
        value = 'REDEEM'
      } else if (column === 'Payment Type') {
        value = 'Check'
      } else if (column === rebateFields.subscription) {
        value = value ? 'checked' : ''
      } else if (column === rebateFields.interests && Array.isArray(value)) {
        value = value.map(item => JSON.stringify(item)).join('; ')
      } else if (!value) {
        value = '' // Ensure undefined, null, or missing values are empty
      } else if (value instanceof Date) {
        value = value.toISOString()
      }

      // Escape double quotes in values
      return `"${String(value).replace(/"/g, '""')}"`
    })

    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}


export const downloadCSV = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

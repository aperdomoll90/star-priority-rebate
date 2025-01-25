import { IAdminPortalProps } from '@/components/adminPortal/AdminPortal'

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
    subscription = 'Subscription',
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
    'Form',
    rebateFields.store_name,
    rebateFields.store_city,
    'Store Country',
    'Store St',
    'Purchase Date',
    'Postmarkdate',
    'Type',
    'Size',
    'Make',
    rebateFields.comments1,
    'Comments2',
    rebateFields.subscription,
    rebateFields.interests,
    rebateFields.date_added,
    'Payment Type',
    'Source',
  ]

  const csvRows = [csvColumns.join(',')]

  rebates.forEach(rebate => {
    const row = csvColumns.map(column => {
      let value: any = ''

      const fieldKey = Object.keys(rebateFields).find(key => rebateFields[key as keyof typeof rebateFields] === column) as keyof IAdminPortalProps | undefined

      if (fieldKey) {
        value = rebate[fieldKey]
      }

      if (column === 'Form') {
        value = 'REDEEM'
      } else if (column === 'Payment Type') {
        value = 'Check'
      } else if (column === rebateFields.subscription) {
        value = value ? 'checked' : ''
      } else if (column === rebateFields.interests && Array.isArray(value)) {
        value = value.map(item => String(item)).join(', ')
      } else if (!value) {
        value = ''
      }

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

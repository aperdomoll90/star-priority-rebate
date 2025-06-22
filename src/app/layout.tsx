import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Priority Rebate',
  description: 'StarBright Rebate redemption portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <div id='page'>{children}</div>
      </body>
    </html>
  )
}

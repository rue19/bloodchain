import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloodChain — Emergency Blood Network',
  description: 'A verified blood donor registry on Stellar blockchain. Level 1 White Belt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
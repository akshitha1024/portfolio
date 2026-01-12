import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Limelight, Libre_Baskerville, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const limelight = Limelight({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-limelight'
})
const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-libre'
})
const spaceGrotesk = Space_Grotesk({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space'
})

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${limelight.variable} ${libreBaskerville.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  )
}

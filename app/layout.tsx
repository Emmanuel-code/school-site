import type { Metadata, Viewport } from 'next'
import './globals.css'
import SetupGate from "@/components/SetupGate"

export const metadata: Metadata = {
  title: 'Bernavi International School',
  description: 'Bernavi International School, Tamale — Crèche to JHS. Apply online, track your application, pay fees and view results from the parent portal.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SetupGate>{children}</SetupGate>
      </body>
    </html>
  )
}

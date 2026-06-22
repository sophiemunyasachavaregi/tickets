import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "BTS WORLD TOUR 'ARIRANG' | Ticket Presale",
  description: 'Official presale partner for BTS WORLD TOUR ARIRANG in Bulacan, Philippine Sports Stadium. Powered by Ticketmaster.ph.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

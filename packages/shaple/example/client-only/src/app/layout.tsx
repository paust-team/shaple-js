import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import classNames from "classnames";
import {ShapleProvider} from '@/components/Shaple';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth Example',
  description: 'This is auth example page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className={classNames("h-full", inter.className)}>
        <ShapleProvider>
          {children}
        </ShapleProvider>
      </body>
    </html>
  )
}

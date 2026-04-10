import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Gaussia — AI Response Measurement Library',
  description: 'Open-source library for evaluating AI-generated content. Detect prompt injection, jailbreaking, bias, toxicity, and ensure AI safety across edge, server, and hardware environments. Crafted by Alquimia AI.',
  keywords: ['AI safety', 'LLM evaluation', 'prompt injection detection', 'AI metrics', 'machine learning', 'Gaussia', 'Alquimia AI'],
  authors: [{ name: 'Alquimia AI' }],
  openGraph: {
    title: 'Gaussia — AI Response Measurement Library',
    description: 'Open-source library for evaluating AI-generated content. Detect prompt injection, jailbreaking, bias, and ensure AI safety.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaussia — AI Response Measurement Library',
    description: 'Open-source library for evaluating AI-generated content across edge, server, and hardware environments.',
  },
}

export const viewport: Viewport = {
  themeColor: '#ab412d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

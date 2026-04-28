import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Gaussia — Metrics grounded in science, built by the community",
  description:
    "Open-source metrics that are paper-backed, reproducible, and language-agnostic. Evaluate, protect, and improve AI behaviour with open, auditable tools.",
  generator: "v0.app",
  openGraph: {
    title: "Gaussia — Metrics grounded in science, built by the community",
    description:
      "Open-source metrics that are paper-backed, reproducible, and language-agnostic.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#f1ede4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrains.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

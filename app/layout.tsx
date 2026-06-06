import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "AfriQ AI — Learn Somali, Kiswahili & English",
  description: "AI-powered African language learning for Somali communities in Kenya, Ethiopia, Somalia, and the diaspora.",
  keywords: ["Somali language", "Kiswahili", "African language learning", "AI tutor", "language app"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

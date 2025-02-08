import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import TopNav from "@/components/TopNav"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "StockAI",
  description: "Cap table management for startups",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopNav />
            <main className="flex-1 bg-white">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
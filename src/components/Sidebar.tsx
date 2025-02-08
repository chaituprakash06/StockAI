"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, PieChart, Home } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  console.log('Current pathname:', pathname) // Debug current path

  const menuItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Documents", icon: FileText, href: "/documents" },
    { title: "Cap Tables", icon: PieChart, href: "/cap-tables" },
  ]

  return (
    <div className="w-64 h-screen border-r bg-white">
      <div className="p-4">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold mb-6">StockAI</h1>
        </Link>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            console.log(`Menu item ${item.title}:`, { href: item.href, isActive }) // Debug menu items

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive 
                    ? "bg-black text-white" 
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
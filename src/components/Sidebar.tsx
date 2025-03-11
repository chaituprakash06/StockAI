"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, PieChart, Home, DollarSign } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Documents", icon: FileText, href: "/documents" },
    { title: "SAFEs", icon: DollarSign, href: "/safes" },
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
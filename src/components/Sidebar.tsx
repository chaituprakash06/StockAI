"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, PieChart, Home, Menu, X } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Documents", icon: FileText, href: "/documents" },
    { title: "SAFEs", icon: PieChart, href: "/safes" },
    { title: "Cap Tables", icon: PieChart, href: "/cap-tables" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-30">
        <button onClick={toggleMobileMenu} className="p-2 rounded-md bg-white shadow-sm border">
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div 
        className={`
          fixed md:static h-screen z-20
          ${isMobileMenuOpen ? 'left-0' : '-left-64'} 
          md:left-0 transition-all duration-300 ease-in-out
          w-64 border-r bg-white
        `}
      >
        <div className="p-4">
          <Link href="/" className="block" onClick={() => setIsMobileMenuOpen(false)}>
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Spacer for mobile to push content down */}
      <div className="md:hidden h-16"></div>
    </>
  )
}
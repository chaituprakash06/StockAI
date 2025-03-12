"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, PieChart, Home, Menu, X, Info, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Public navigation links (shown to all users)
  const publicLinks = [
    { title: "Home", icon: Home, href: "/" },
    { title: "About", icon: Info, href: "/about" },
    { title: "Contact", icon: Mail, href: "/contact" }
  ]
  
  // Private navigation links (shown only to authenticated users)
  const privateLinks = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Documents", icon: FileText, href: "/documents" },
    { title: "SAFEs", icon: PieChart, href: "/safes" },
    { title: "Cap Tables", icon: PieChart, href: "/cap-tables" }
  ]
  
  // Use the appropriate set of navigation links based on authentication status
  const menuItems = user ? privateLinks : publicLinks

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
          w-64 border-r bg-gradient-to-b from-gray-900 to-purple-900
        `}
      >
        <div className="p-4">
          <Link href="/" className="block logo-container" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-xl font-bold mb-6 text-white">StockAI</h1>
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
                      ? "bg-white/20 text-white" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Authentication links */}
          <div className="mt-8 pt-4 border-t border-white/10">
            {user ? (
              <button
                onClick={() => {
                  const { signOut } = require('@/lib/auth-context').useAuth();
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for mobile to push content down */}
      <div className="md:hidden h-16"></div>

      {/* Add global styles for the logo margin */}
      <style jsx global>{`
        @media (max-width: 720px) {
          .logo-container {
            margin-left: 20px;
          }
        }
      `}</style>
    </>
  )
}
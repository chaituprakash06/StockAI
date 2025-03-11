import React from "react"

export default function TopNav() {
  return (
    <nav className="h-12 md:h-16 px-2 md:px-6 border-b bg-white flex items-center justify-end">
      <button className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm border rounded-md hover:bg-gray-50">
        Login
      </button>
    </nav>
  )
}
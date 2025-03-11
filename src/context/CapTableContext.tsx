// src/context/CapTableContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type Shareholder = {
  name: string
  shares: string
  percentage: string
}

// New type for SAFE investments
type SAFE = {
  id: string
  investorName: string
  amount: number
  valuationCap: number | null
  discountRate: number | null
  date: string
  type: 'valuation-cap' | 'discount' | 'mfn' | 'both'
}

interface CapTableContextType {
  initialShareholders: Shareholder[]
  setInitialShareholders: React.Dispatch<React.SetStateAction<Shareholder[]>>
  safes: SAFE[]
  setSafes: React.Dispatch<React.SetStateAction<SAFE[]>>
}

const CapTableContext = createContext<CapTableContextType | undefined>(undefined)

export function CapTableProvider({ children }: { children: ReactNode }) {
  const [initialShareholders, setInitialShareholders] = useState<Shareholder[]>([
    { name: "Founder", shares: "1000000", percentage: "100" }
  ])
  
  const [safes, setSafes] = useState<SAFE[]>([])

  return (
    <CapTableContext.Provider value={{ 
      initialShareholders, 
      setInitialShareholders,
      safes,
      setSafes
    }}>
      {children}
    </CapTableContext.Provider>
  )
}

export function useCapTable() {
  const context = useContext(CapTableContext)
  if (context === undefined) {
    throw new Error("useCapTable must be used within a CapTableProvider")
  }
  return context
}
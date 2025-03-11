"use client"

import React, { useState, useEffect } from "react"
import { useCapTable } from "@/context/CapTableContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Info } from "lucide-react"

type Shareholder = {
  name: string
  shares: number
  percentage: number
}

type Round = {
  name: string
  amount: string
  valuation: string
  newInvestor: string
  capTable: Shareholder[]
  includeSafes: boolean
}

type ChartDataItem = {
  name: string
  value: number
}

// Generate colors for pie chart
const COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

export default function CapTables() {
  const { initialShareholders, safes } = useCapTable()
  const [initialCapTable, setInitialCapTable] = useState<Shareholder[]>([])
  
  // Convert string-based shareholders to number-based cap table format
  useEffect(() => {
    const convertedCapTable = initialShareholders.map(shareholder => ({
      name: shareholder.name,
      shares: Number(shareholder.shares) || 0,
      percentage: Number(shareholder.percentage) || 0
    }))
    setInitialCapTable(convertedCapTable)
  }, [initialShareholders])

  // Persist round data across navigation using localStorage
  const loadSavedRounds = (): Round[] => {
    try {
      const savedRounds = localStorage.getItem('roundData')
      if (savedRounds) {
        const parsed = JSON.parse(savedRounds)
        // Filter out Pre-seed round if it exists in saved data
        return parsed.filter((round: Round) => round.name !== "Pre-seed")
      }
    } catch (error) {
      console.error('Error loading saved rounds:', error)
    }
    
    // Default rounds if no saved data - without Pre-seed
    return [
      { 
        name: "Seed", 
        amount: "", 
        valuation: "", 
        newInvestor: "", 
        capTable: [],
        includeSafes: true
      },
      { 
        name: "Series A", 
        amount: "", 
        valuation: "", 
        newInvestor: "", 
        capTable: [],
        includeSafes: true
      },
    ]
  }

  const [rounds, setRounds] = useState<Round[]>(loadSavedRounds())
  const [selectedRound, setSelectedRound] = useState<Round>(rounds[0])

  // Save rounds to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('roundData', JSON.stringify(rounds))
    } catch (error) {
      console.error('Error saving rounds data:', error)
    }
  }, [rounds])

  // Make sure initialCapTable is used for current cap table display
  useEffect(() => {
    // Update all rounds to use initialCapTable as the base
    setRounds(prev => {
      return prev.map(round => ({
        ...round
      }))
    })
  }, [initialCapTable])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedRound = { ...selectedRound, [name]: value }
    setSelectedRound(updatedRound)
    
    // Update the round in the rounds array to persist changes
    setRounds(prev => 
      prev.map(round => 
        round.name === selectedRound.name ? updatedRound : round
      )
    )
  }

  const toggleSafeInclusion = () => {
    const updatedRound = { ...selectedRound, includeSafes: !selectedRound.includeSafes }
    setSelectedRound(updatedRound)
    
    // Update the round in the rounds array
    setRounds(prev => 
      prev.map(round => 
        round.name === selectedRound.name ? updatedRound : round
      )
    )
  }

  // Calculate how SAFEs convert at a priced round
  const calculateSafeConversion = (
    investmentAmount: number, 
    valuationCap: number | null, 
    discountRate: number | null, 
    pricedRoundValuation: number
  ) => {
    // Skip invalid SAFEs or if priced round valuation is not set
    if (!investmentAmount || !pricedRoundValuation) return null

    // If no valuation cap or discount, this is an MFN SAFE - convert at priced round terms
    if (!valuationCap && !discountRate) {
      return {
        effectiveValuation: pricedRoundValuation,
        ownershipPercentage: (investmentAmount / pricedRoundValuation) * 100
      }
    }

    let effectiveValuation = pricedRoundValuation

    // Apply discount if available
    if (discountRate) {
      const discountMultiplier = 1 - (discountRate / 100)
      const discountedValuation = pricedRoundValuation * discountMultiplier
      effectiveValuation = discountedValuation
    }

    // Apply valuation cap if available and better than discounted valuation
    if (valuationCap && valuationCap < effectiveValuation) {
      effectiveValuation = valuationCap
    }

    const ownershipPercentage = (investmentAmount / effectiveValuation) * 100

    return {
      effectiveValuation,
      ownershipPercentage
    }
  }

  const generateCapTable = () => {
    // Get current cap table - now always using the initial cap table
    const prevCapTable = initialCapTable.length > 0 
      ? initialCapTable 
      : [{ name: "Founder", shares: 1000000, percentage: 100 }]
      
    // Calculate based on post-money valuation
    const investmentAmount = Number(selectedRound.amount)
    const postMoneyValuation = Number(selectedRound.valuation)
    
    // Error handling
    if (!investmentAmount || !postMoneyValuation || investmentAmount > postMoneyValuation) {
      alert("Please enter valid investment amount and post-money valuation")
      return
    }
    
    // Calculate pre-money valuation
    const preMoneyValuation = postMoneyValuation - investmentAmount
    
    // Calculate price per share using pre-money valuation
    const totalPreMoneyShares = prevCapTable.reduce((sum, row) => sum + row.shares, 0)
    const pricePerShare = preMoneyValuation / totalPreMoneyShares
    
    // Calculate new shares for primary investor
    const newInvestorShares = Math.floor(investmentAmount / pricePerShare)
    
    // Process SAFEs if included in this round
    let safeInvestments: Shareholder[] = []
    let totalSafeShares = 0
    
    if (selectedRound.includeSafes && safes.length > 0) {
      safeInvestments = safes.map(safe => {
        const conversion = calculateSafeConversion(
          safe.amount,
          safe.valuationCap,
          safe.discountRate,
          postMoneyValuation
        )
        
        if (!conversion) return null
        
        // Calculate effective price per share for this SAFE
        const effectivePricePerShare = conversion.effectiveValuation / totalPreMoneyShares
        
        // Calculate shares for SAFE investor
        const safeShares = Math.floor(safe.amount / effectivePricePerShare)
        totalSafeShares += safeShares
        
        return {
          name: `SAFE: ${safe.investorName}`,
          shares: safeShares,
          percentage: 0 // Will calculate after we know total shares
        }
      }).filter(Boolean) as Shareholder[]
    }
    
    // Calculate total shares after new issuance
    const totalShares = totalPreMoneyShares + newInvestorShares + totalSafeShares
    
    // Create new cap table with updated percentages
    const newCapTable = [
      ...prevCapTable.map(row => ({
        ...row,
        // Recalculate ownership percentage
        percentage: (row.shares / totalShares) * 100,
      })),
      // Add SAFE investors
      ...safeInvestments.map(safe => ({
        ...safe,
        // Calculate ownership percentage
        percentage: (safe.shares / totalShares) * 100,
      })),
      // Add primary investor
      {
        name: selectedRound.newInvestor,
        shares: newInvestorShares,
        percentage: (newInvestorShares / totalShares) * 100,
      },
    ].filter(row => row.name && row.shares > 0) // Filter out any empty or zero share entries
    
    // Update the round's cap table
    const updatedRound = { ...selectedRound, capTable: newCapTable }
    setSelectedRound(updatedRound)
    
    setRounds(rounds.map(round =>
      round.name === selectedRound.name ? updatedRound : round
    ))
  }

  // Format data for pie chart
  const getChartData = (capTable: Shareholder[]): ChartDataItem[] => {
    return capTable.map(item => ({
      name: item.name,
      value: item.percentage
    }));
  }

  // Format currency for display
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cap Table Management</h1>
      
      <div className="flex gap-2 mb-6">
        {rounds.map((round: Round) => (
          <button
            key={round.name}
            onClick={() => setSelectedRound(round)}
            className={`px-4 py-2 rounded-md ${
              selectedRound.name === round.name
                ? "bg-black text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {round.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Round Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Investment Amount ($)</label>
                <input
                  name="amount"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={selectedRound.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Post-Money Valuation ($)</label>
                <input
                  name="valuation"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={selectedRound.valuation}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Investor Name</label>
                <input
                  name="newInvestor"
                  className="w-full p-2 border rounded-md"
                  value={selectedRound.newInvestor}
                  onChange={handleInputChange}
                />
              </div>
              
              {/* SAFE conversion option */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="includeSafes"
                  checked={selectedRound.includeSafes}
                  onChange={toggleSafeInclusion}
                  className="h-4 w-4 text-black"
                />
                <label htmlFor="includeSafes" className="text-sm">
                  Convert existing SAFEs in this round
                </label>
                <div className="relative group">
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48">
                    SAFEs will convert based on their valuation cap and/or discount rate terms.
                  </div>
                </div>
              </div>
              
              {/* Show SAFE info if selected */}
              {selectedRound.includeSafes && safes.length > 0 && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <h3 className="font-medium mb-2">SAFE Conversion Preview</h3>
                  <ul className="space-y-2">
                    {safes.map(safe => {
                      const conversion = calculateSafeConversion(
                        safe.amount,
                        safe.valuationCap,
                        safe.discountRate,
                        Number(selectedRound.valuation)
                      )
                      
                      return (
                        <li key={safe.id} className="flex justify-between">
                          <span>{safe.investorName}</span>
                          <span className="font-medium">
                            {conversion && Number(selectedRound.valuation) 
                              ? `~${conversion.ownershipPercentage.toFixed(2)}%` 
                              : 'N/A'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              
              {/* Show message if no SAFEs exist */}
              {selectedRound.includeSafes && safes.length === 0 && (
                <div className="text-sm text-amber-600">
                  No SAFEs found. Add SAFEs in the SAFEs section to include them in this round.
                </div>
              )}
              
              <button 
                onClick={generateCapTable}
                className="w-full px-4 py-2 bg-black text-white rounded-md"
              >
                Generate Cap Table
              </button>
            </div>
          </div>
          
          {/* Round Summary/Metrics */}
          {selectedRound.capTable.length > 0 && selectedRound.valuation && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Round Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Investment Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedRound.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Post-Money Valuation:</span>
                  <span className="font-medium">{formatCurrency(selectedRound.valuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pre-Money Valuation:</span>
                  <span className="font-medium">
                    {formatCurrency(Number(selectedRound.valuation) - Number(selectedRound.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Investor Ownership:</span>
                  <span className="font-medium">
                    {selectedRound.capTable.find(r => r.name === selectedRound.newInvestor)?.percentage.toFixed(2)}%
                  </span>
                </div>
                {selectedRound.includeSafes && safes.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">SAFE Conversion Total:</span>
                    <span className="font-medium">
                      {selectedRound.capTable
                        .filter(r => r.name.startsWith('SAFE:'))
                        .reduce((sum, r) => sum + r.percentage, 0)
                        .toFixed(2)}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Founder Dilution:</span>
                  <span className="font-medium">
                    {selectedRound.capTable.find(r => r.name === "Founder") ?
                      (100 - Number(selectedRound.capTable.find(r => r.name === "Founder")?.percentage.toFixed(2))).toFixed(2) + "%" :
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Current Cap Table Section */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Cap Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Shareholder</th>
                    <th className="pb-2 text-right">Shares</th>
                    <th className="pb-2 text-right">Ownership</th>
                  </tr>
                </thead>
                <tbody>
                  {initialCapTable.length > 0 ? (
                    initialCapTable.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{row.name}</td>
                        <td className="py-2 text-right">{row.shares.toLocaleString()}</td>
                        <td className="py-2 text-right">{row.percentage.toFixed(2)}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        No data available. Add shareholders in Documents section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Projected Cap Table Section */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Projected Cap Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full mb-6">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Shareholder</th>
                    <th className="pb-2 text-right">Shares</th>
                    <th className="pb-2 text-right">Ownership</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRound.capTable.length > 0 ? (
                    selectedRound.capTable.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{row.name}</td>
                        <td className="py-2 text-right">{row.shares.toLocaleString()}</td>
                        <td className="py-2 text-right">{row.percentage.toFixed(2)}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        Generate cap table to see projections
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Pie Chart for Projected Cap Table */}
              {selectedRound.capTable.length > 0 && (
                <div className="h-64 mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Ownership Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData(selectedRound.capTable)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getChartData(selectedRound.capTable).map((entry: ChartDataItem, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `${Number(value).toFixed(2)}%`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
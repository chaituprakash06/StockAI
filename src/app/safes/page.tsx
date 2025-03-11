"use client"

import React, { useState } from "react"
import { useCapTable } from "@/context/CapTableContext"
import { PlusCircle, Trash2 } from "lucide-react"

type SAFE = {
  id: string
  investorName: string
  amount: number
  valuationCap: number | null
  discountRate: number | null
  date: string
  type: 'valuation-cap' | 'discount' | 'mfn' | 'both'
}

type Error = {
  message: string
}

export default function SAFEsPage() {
  const { safes, setSafes, saveSafeToDatabase, deleteSafeFromDatabase } = useCapTable()
  const [newSafe, setNewSafe] = useState<SAFE>({
    id: "",
    investorName: "",
    amount: 0,
    valuationCap: null,
    discountRate: null,
    date: new Date().toISOString().split('T')[0],
    type: 'valuation-cap'
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'type') {
      // Reset values based on SAFE type
      if (value === 'valuation-cap') {
        setNewSafe(prev => ({ ...prev, type: value as 'valuation-cap', discountRate: null }))
      } else if (value === 'discount') {
        setNewSafe(prev => ({ ...prev, type: value as 'discount', valuationCap: null }))
      } else if (value === 'both') {
        setNewSafe(prev => ({ ...prev, type: value as 'both' }))
      } else {
        setNewSafe(prev => ({ ...prev, type: value as 'mfn', valuationCap: null, discountRate: null }))
      }
    } else if (name === 'valuationCap' || name === 'amount' || name === 'discountRate') {
      setNewSafe(prev => ({ ...prev, [name]: value ? Number(value) : null }))
    } else {
      setNewSafe(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const addSafe = async () => {
    // Validate
    if (!newSafe.investorName || !newSafe.amount) {
      alert("Please enter investor name and investment amount")
      return
    }
    
    if (newSafe.type === 'valuation-cap' && !newSafe.valuationCap) {
      alert("Please enter valuation cap")
      return
    }
    
    if (newSafe.type === 'discount' && !newSafe.discountRate) {
      alert("Please enter discount rate")
      return
    }
    
    if (newSafe.type === 'both' && (!newSafe.valuationCap || !newSafe.discountRate)) {
      alert("Please enter both valuation cap and discount rate")
      return
    }
    
    // Add new SAFE with unique ID
    const safeToAdd = {
      ...newSafe,
      id: Date.now().toString()
    }
    
    try {
      await saveSafeToDatabase(safeToAdd)
      setSafes([...safes, safeToAdd])
    } catch (error) {
      const typedError = error as Error
      console.error('Error adding SAFE:', typedError.message)
      alert(`Failed to save SAFE: ${typedError.message}`)
    }
    
    // Reset form
    setNewSafe({
      id: "",
      investorName: "",
      amount: 0,
      valuationCap: null,
      discountRate: null,
      date: new Date().toISOString().split('T')[0],
      type: 'valuation-cap'
    })
  }
  
  const removeSafe = async (id: string) => {
    try {
      await deleteSafeFromDatabase(id)
      setSafes(safes.filter(safe => safe.id !== id))
    } catch (error) {
      const typedError = error as Error
      console.error('Error removing SAFE:', typedError.message)
      alert(`Failed to remove SAFE: ${typedError.message}`)
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">SAFE Investments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add new SAFE */}
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New SAFE</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Investor Name</label>
              <input
                name="investorName"
                type="text"
                className="w-full p-2 border rounded-md"
                value={newSafe.investorName}
                onChange={handleInputChange}
                placeholder="Enter investor name"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Investment Amount ($)</label>
              <input
                name="amount"
                type="number"
                className="w-full p-2 border rounded-md"
                value={newSafe.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter investment amount"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Investment Date</label>
              <input
                name="date"
                type="date"
                className="w-full p-2 border rounded-md"
                value={newSafe.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">SAFE Type</label>
              <select
                name="type"
                className="w-full p-2 border rounded-md"
                value={newSafe.type}
                onChange={handleInputChange}
              >
                <option value="valuation-cap">Valuation Cap Only</option>
                <option value="discount">Discount Only</option>
                <option value="both">Valuation Cap & Discount</option>
                <option value="mfn">MFN (Most Favored Nation)</option>
              </select>
            </div>
            
            {(newSafe.type === 'valuation-cap' || newSafe.type === 'both') && (
              <div>
                <label className="block text-sm mb-1">Valuation Cap ($)</label>
                <input
                  name="valuationCap"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newSafe.valuationCap || ''}
                  onChange={handleInputChange}
                  placeholder="Enter valuation cap"
                />
              </div>
            )}
            
            {(newSafe.type === 'discount' || newSafe.type === 'both') && (
              <div>
                <label className="block text-sm mb-1">Discount Rate (%)</label>
                <input
                  name="discountRate"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newSafe.discountRate || ''}
                  onChange={handleInputChange}
                  placeholder="Enter discount rate (e.g. 20)"
                  min="0"
                  max="100"
                />
              </div>
            )}
            
            <button
              onClick={addSafe}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add SAFE</span>
            </button>
          </div>
        </div>
        
        {/* List of SAFEs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your SAFE Investments</h2>
          
          {safes.length === 0 ? (
            <div className="p-6 bg-white rounded-lg border shadow-sm text-center">
              <p className="text-gray-500">No SAFEs added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safes.map((safe) => (
                <div key={safe.id} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{safe.investorName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(safe.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSafe(safe.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>{' '}
                      <span className="font-medium">{formatCurrency(safe.amount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>{' '}
                      <span className="font-medium capitalize">
                        {safe.type === 'both' ? 'Cap & Discount' : 
                         safe.type === 'mfn' ? 'MFN' : 
                         safe.type === 'valuation-cap' ? 'Valuation Cap' : 'Discount'}
                      </span>
                    </div>
                    
                    {safe.valuationCap && (
                      <div>
                        <span className="text-gray-500">Valuation Cap:</span>{' '}
                        <span className="font-medium">{formatCurrency(safe.valuationCap)}</span>
                      </div>
                    )}
                    
                    {safe.discountRate && (
                      <div>
                        <span className="text-gray-500">Discount:</span>{' '}
                        <span className="font-medium">{safe.discountRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
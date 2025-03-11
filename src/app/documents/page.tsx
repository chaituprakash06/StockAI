"use client"

import React, { useState } from "react"
import { useCapTable } from "@/context/CapTableContext"

type Shareholder = {
  name: string
  shares: string
  percentage: string
}

export default function DocumentsPage() {
  const { initialShareholders, setInitialShareholders } = useCapTable()
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload')

  const addShareholder = () => {
    setInitialShareholders([...initialShareholders, { name: "", shares: "", percentage: "" }])
  }

  const updateShareholder = (index: number, field: keyof Shareholder, value: string) => {
    const newShareholders = [...initialShareholders]
    newShareholders[index][field] = value
    
    // Calculate percentages if shares are updated
    if (field === 'shares') {
      const totalShares = newShareholders.reduce(
        (sum, s) => sum + (Number(s.shares) || 0), 
        0
      )
      
      newShareholders.forEach(s => {
        const shares = Number(s.shares) || 0
        s.percentage = totalShares > 0 ? ((shares / totalShares) * 100).toFixed(2) : "0"
      })
    }
    
    setInitialShareholders(newShareholders)
  }

  const removeShareholder = (index: number) => {
    const newShareholders = [...initialShareholders]
    newShareholders.splice(index, 1)
    setInitialShareholders(newShareholders)
  }

  const saveCapTable = () => {
    console.log('Saving cap table:', initialShareholders)
    // Here you would save the cap table data to your backend or local storage
    alert('Cap table saved!')
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Company Documents</h1>
      
      <div className="mb-4 md:mb-6">
        <div className="flex border-b w-full overflow-x-auto">
          <button
            className={`py-2 px-3 md:px-4 whitespace-nowrap ${activeTab === 'upload' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Documents
          </button>
          <button
            className={`py-2 px-3 md:px-4 whitespace-nowrap ${activeTab === 'manual' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
        </div>
      </div>
      
      {activeTab === 'upload' && (
        <div className="w-full">
          <div className="p-4 md:p-6 bg-white rounded-lg border shadow-sm">
            <div className="border-2 border-dashed rounded-lg p-6 md:p-12 text-center">
              <p className="text-gray-500 mb-4">Drop your files here, or click to browse</p>
              <label>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => console.log('Files selected:', e.target.files)}
                  multiple
                />
                <span className="px-4 py-2 bg-black text-white rounded-md cursor-pointer inline-block hover:bg-gray-800">
                  Upload Documents
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'manual' && (
        <div className="w-full">
          <div className="p-4 md:p-6 bg-white rounded-lg border shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Initial Cap Table</h2>
            <p className="text-sm text-gray-500 mb-4 md:mb-6">Enter your company&apos;s current ownership structure</p>
            
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-full px-4 md:px-0">
                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Shareholder</th>
                      <th className="text-left pb-2">Shares</th>
                      <th className="text-left pb-2">Percentage</th>
                      <th className="text-left pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialShareholders.map((shareholder, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 pr-2 md:pr-4">
                          <input
                            type="text"
                            value={shareholder.name}
                            onChange={(e) => updateShareholder(index, 'name', e.target.value)}
                            className="w-full p-1 md:p-2 border rounded text-sm md:text-base"
                            placeholder="Name"
                          />
                        </td>
                        <td className="py-2 pr-2 md:pr-4">
                          <input
                            type="number"
                            value={shareholder.shares}
                            onChange={(e) => updateShareholder(index, 'shares', e.target.value)}
                            className="w-full p-1 md:p-2 border rounded text-sm md:text-base"
                            placeholder="Shares"
                          />
                        </td>
                        <td className="py-2 pr-2 md:pr-4">
                          <input
                            type="text"
                            value={shareholder.percentage}
                            readOnly
                            className="w-full p-1 md:p-2 border rounded bg-gray-50 text-sm md:text-base"
                            placeholder="0%"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => removeShareholder(index)}
                            className="p-1 md:p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove shareholder"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={addShareholder}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm md:text-base"
              >
                Add Shareholder
              </button>
              
              <button
                onClick={saveCapTable}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm md:text-base"
              >
                Save Cap Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
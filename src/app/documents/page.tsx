// src/app/documents/page.tsx
"use client"

import React, { useState } from "react"
import { useCapTable } from "@/context/CapTableContext"

type Shareholder = {
  name: string
  shares: string
  percentage: string
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload')
  const { initialShareholders, setInitialShareholders } = useCapTable()

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
    // Data is already saved in context
    alert('Cap table saved!')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Company Documents</h1>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Documents
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
        </div>
      </div>
      
      {activeTab === 'upload' && (
        <div className="max-w-3xl">
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
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
        <div className="max-w-4xl">
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Initial Cap Table</h2>
            <p className="text-gray-500 mb-6">Enter your company's current ownership structure</p>
            
            <div className="overflow-x-auto">
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
                      <td className="py-2 pr-4">
                        <input
                          type="text"
                          value={shareholder.name}
                          onChange={(e) => updateShareholder(index, 'name', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Name"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="number"
                          value={shareholder.shares}
                          onChange={(e) => updateShareholder(index, 'shares', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Number of shares"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="text"
                          value={shareholder.percentage}
                          readOnly
                          className="w-full p-2 border rounded bg-gray-50"
                          placeholder="0%"
                        />
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => removeShareholder(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={addShareholder}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Add Shareholder
              </button>
              
              <button
                onClick={saveCapTable}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
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
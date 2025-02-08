"use client"

import React, { useState } from "react"

type Round = {
    name: string
    amount: string
    valuation: string
    newInvestor: string
    capTable: { name: string; shares: number; percentage: number }[]
  }
  
  const initialRounds: Round[] = [
    {
      name: "Pre-seed",
      amount: "",
      valuation: "",
      newInvestor: "",
      capTable: [{ name: "Founder", shares: 1000000, percentage: 100 }],
    },
    { name: "Seed", amount: "", valuation: "", newInvestor: "", capTable: [] },
    { name: "Series A", amount: "", valuation: "", newInvestor: "", capTable: [] },
  ]
  
  export default function CapTables() {
    const [rounds, setRounds] = useState<Round[]>(initialRounds)
    const [selectedRound, setSelectedRound] = useState<Round>(rounds[0])
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setSelectedRound(prev => ({ ...prev, [name]: value }))
    }
  
    const generateCapTable = () => {
      const prevRoundIndex = rounds.findIndex(round => round.name === selectedRound.name) - 1
      const prevCapTable = prevRoundIndex >= 0 
        ? rounds[prevRoundIndex].capTable 
        : [{ name: "Founder", shares: 1000000, percentage: 100 }]
  
      const newShares = Math.floor((Number(selectedRound.amount) / Number(selectedRound.valuation)) * 1000000)
      const totalShares = prevCapTable.reduce((sum, row) => sum + row.shares, 0) + newShares
  
      const newCapTable = [
        ...prevCapTable.map(row => ({
          ...row,
          percentage: (row.shares / totalShares) * 100,
        })),
        {
          name: selectedRound.newInvestor,
          shares: newShares,
          percentage: (newShares / totalShares) * 100,
        },
      ]
  
      setRounds(rounds.map(round =>
        round.name === selectedRound.name 
          ? { ...selectedRound, capTable: newCapTable }
          : round
      ))
    }
  
    return (
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {rounds.map((round) => (
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
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Round Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Amount ($)</label>
                <input
                  name="amount"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={selectedRound.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Valuation ($)</label>
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
              <button 
                onClick={generateCapTable}
                className="w-full px-4 py-2 bg-black text-white rounded-md"
              >
                Generate Cap Table
              </button>
            </div>
          </div>
  
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cap Table</h2>
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
                  {selectedRound.capTable.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{row.name}</td>
                      <td className="py-2 text-right">{row.shares.toLocaleString()}</td>
                      <td className="py-2 text-right">{row.percentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
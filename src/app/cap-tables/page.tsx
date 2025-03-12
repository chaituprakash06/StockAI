"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCapTable } from "@/context/CapTableContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Convert strings to numbers safely
const toNumber = (value: string) => Number(value) || 0;

type CapTableEntry = {
  name: string;
  shares: number;
  percentage: number;
};

export default function CapTablesPage() {
  const { initialShareholders } = useCapTable();
  const [capTable, setCapTable] = useState<CapTableEntry[]>([]);
  const [totalShares, setTotalShares] = useState<number>(0);

  // Convert string-based shareholders to number-based cap table format
  useEffect(() => {
    if (!initialShareholders || initialShareholders.length === 0) {
      return;
    }
    
    const convertedCapTable = initialShareholders.map(shareholder => ({
      name: shareholder.name,
      shares: toNumber(shareholder.shares),
      percentage: toNumber(shareholder.percentage)
    }));
    
    setCapTable(convertedCapTable);
    
    // Calculate total shares
    const total = convertedCapTable.reduce((sum, entry) => sum + entry.shares, 0);
    setTotalShares(total);
  }, [initialShareholders]);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen pt-16 pb-12 px-4 md:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
        </div>
        
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Cap Table Management
          </motion.h1>
          
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Current Cap Table</h2>
            
            {capTable.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-white/80">Shareholder</th>
                      <th className="text-right p-3 text-white/80">Shares</th>
                      <th className="text-right p-3 text-white/80">Ownership</th>
                    </tr>
                  </thead>
                  <tbody>
                    {capTable.map((entry, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="p-3 text-white">{entry.name}</td>
                        <td className="p-3 text-right text-white">
                          {entry.shares.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-white">
                          {entry.percentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white/5">
                      <td className="p-3 font-semibold text-white">Total</td>
                      <td className="p-3 text-right font-semibold text-white">
                        {totalShares.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-semibold text-white">
                        100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-10 text-white/70">
                <p>No shareholders found. Add shareholders to see your cap table.</p>
                <button 
                  className="mt-4 px-6 py-2 bg-white text-purple-800 rounded-lg font-medium"
                >
                  Add Shareholders
                </button>
              </div>
            )}
          </motion.div>
          
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Cap Table Visualization</h2>
            
            {capTable.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-white">
                  {/* Here you would integrate a chart library like Recharts */}
                  <p className="text-center text-white/70">Chart visualization would go here</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 text-white/70">
                <p>Add shareholders to see cap table visualization.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
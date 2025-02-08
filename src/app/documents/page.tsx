"use client"

import React from "react"

export default function DocumentsPage() {  // Changed function name to be more specific
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Company Documents</h1>
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
    </div>
  )
}
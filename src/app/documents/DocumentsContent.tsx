"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function DocumentsContent() {
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Handle the dropped files
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("Files dropped:", e.dataTransfer.files);
      // Process files here
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Files selected:", e.target.files);
      // Process files here
    }
  };
  
  return (
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
          Company Documents
        </motion.h1>
        
        {/* Tabs */}
        <motion.div 
          className="mb-8 border-b border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "upload" 
                  ? "text-white border-b-2 border-white" 
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload Documents
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "manual" 
                  ? "text-white border-b-2 border-white" 
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Entry
            </button>
          </div>
        </motion.div>
        
        {/* Content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {activeTab === "upload" ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center ${
                isDragging ? "border-white bg-white/5" : "border-white/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Drop your files here, or click to browse
                </h3>
                <p className="text-white/70 mb-6">
                  Upload your company documents, SAFEs, term sheets, and cap table to get started.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  multiple
                />
                <motion.button
                  className="px-6 py-3 bg-white text-purple-800 rounded-lg font-medium mx-auto"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload Documents
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-medium text-white mb-6">
                Enter Company Details Manually
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Your Company Inc."
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Total Shares Outstanding
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="10,000,000"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Company Formation Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-white text-purple-800 rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Company
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
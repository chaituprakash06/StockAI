"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-900" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 md:p-8"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            About StockAI
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              StockAI is an AI-powered platform designed to simplify cap table management for startup founders and entrepreneurs. Our mission is to make equity management accessible to everyone without the need for expensive legal consultations.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">What We Do</h2>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              StockAI helps founders track their equity structure through various funding rounds, providing clarity and insight into ownership distribution. With our platform, you can:
            </p>
            
            <ul className="list-disc pl-6 text-white/90 text-lg space-y-2 mb-6">
              <li>Upload and analyze company documents automatically</li>
              <li>Track SAFE investments and convertible notes</li>
              <li>Visualize cap table changes across funding rounds</li>
              <li>Generate projections for future funding scenarios</li>
              <li>Export professional cap table reports</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Technology</h2>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              StockAI leverages advanced machine learning and natural language processing to extract relevant information from legal documents, term sheets, and investment agreements. Our platform continuously improves its understanding of complex equity structures to provide the most accurate insights.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">For Founders, By Founders</h2>
            
            <p className="text-white/90 text-lg leading-relaxed">
              Created by startup founders who experienced the complexity of cap table management firsthand, StockAI is built to solve real problems that entrepreneurs face when navigating equity distribution, dilution, and funding rounds.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
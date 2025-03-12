"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user } = useAuth();
  
  // Set the appropriate Get Started destination
  const getStartedLink = user ? "/documents" : "/signup";

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-900"
          style={{ opacity: 0.8 }}
        />
        
        {/* Moving light spots */}
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-purple-500/30 blur-3xl"
          animate={{ 
            x: [0, 100, 50, 0], 
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ 
            top: '10%', 
            left: '20%',
            filter: 'blur(60px)'
          }}
        />
        
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"
          animate={{ 
            x: [0, -80, -40, 0], 
            y: [0, 80, 40, 0],
            scale: [1, 1.3, 1.1, 1] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ 
            top: '60%', 
            right: '10%',
            filter: 'blur(70px)'
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="w-full max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main heading with animated gradient text */}
          <motion.div 
            className="relative mb-6 inline-block"
            animate={{ 
              rotateZ: [0, 0.5, -0.5, 0],
              scale: [1, 1.01, 0.99, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold tracking-tight text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="inline-block">Stock</span>
              <motion.span 
                className="inline-block bg-gradient-to-r from-fuchsia-400 to-blue-400 text-transparent bg-clip-text"
                animate={{ 
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                AI
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI-powered cap table management that simplifies startup equity tracking without the need for expensive lawyers.
          </motion.p>

          {/* Main CTA button with hover animation */}
          {/* Main CTA button with hover animation - Centered */}
          <motion.div 
            className="mb-16 flex justify-center"  // Added "flex justify-center" here
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href={getStartedLink}>
              <motion.button 
                className="px-8 py-4 bg-white text-purple-800 rounded-lg font-medium text-lg shadow-lg flex items-center space-x-2 group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Started</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature cards with animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href={getStartedLink} className="no-underline">
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Document Analysis</h3>
                <p className="text-white/80">Upload and analyze your company documents with AI.</p>
              </motion.div>
            </Link>
            <Link href={getStartedLink} className="no-underline">
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Cap Table Management</h3>
                <p className="text-white/80">Track and visualize your equity distribution with ease.</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Github } from "lucide-react"; // Changed GitHub to Github (lowercase 'h')

export default function ContactPage() {
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
            Contact Us
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 text-lg leading-relaxed mb-10"
          >
            Have questions about StockAI? We&apos;'re here to help! Reach out to us using any of the methods below.
          </motion.p>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start"
            >
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Email Us</h2>
                <p className="text-white/90">
                  <a href="mailto:contact@stockai.app" className="text-blue-300 hover:underline">
                    chai@talentlex.app
                  </a>
                </p>
                <p className="text-white/70 text-sm mt-1">
                  We typically respond within 24 hours.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start"
            >
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">GitHub</h2>
                <p className="text-white/90">
                  Found a bug or have a feature request? Open an issue on our 
                  <a href="https://github.com/stockai/stockai" className="text-blue-300 hover:underline ml-1">
                    GitHub repository
                  </a>.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
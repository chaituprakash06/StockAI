"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-900 z-0" />
      
      {/* Moving background elements */}
      <motion.div 
        className="absolute w-96 h-96 rounded-full bg-purple-500/30 blur-3xl z-0"
        style={{ top: '10%', left: '20%' }}
        animate={{ 
          x: [0, 100, 50, 0], 
          y: [0, 50, 100, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create your StockAI account</h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Confirmation email sent!</h3>
              <p className="mb-4">Please check your email and click the confirmation link to complete your registration.</p>
              <Link href="/login">
                <motion.button
                  className="w-full bg-white text-purple-800 font-medium py-2 px-4 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Login
                </motion.button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-white/70">Password must be at least 6 characters long</p>
              </div>
              
              <motion.button
                type="submit"
                className="w-full bg-white text-purple-800 font-medium py-2 px-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </motion.button>
            </form>
          )}
          
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline">
                  Login
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
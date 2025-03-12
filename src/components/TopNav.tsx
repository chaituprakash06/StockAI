"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function TopNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  
  // Track scroll position for nav style changes
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  // Public navigation links (shown to all users)
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];
  
  // Private navigation links (shown only to authenticated users)
  const privateLinks = [
    { name: "Documents", href: "/documents" },
    { name: "SAFEs", href: "/safes" },
    { name: "Cap Tables", href: "/cap-tables" }
  ];
  
  // Use the appropriate set of navigation links based on authentication status
  const navLinks = user ? privateLinks : publicLinks;

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? "bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg" 
          : "bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold text-white">StockAI</div>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
            >
              <motion.span
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.span>
            </Link>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <motion.button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-lg bg-white text-purple-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <Link href="/login">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white text-purple-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-purple-900 to-blue-900 md:hidden">
          <div className="flex flex-col items-center py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-center text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-white text-purple-800"
              >
                Logout
              </button>
            ) : (
              <div className="mt-4 flex flex-col space-y-2 w-1/2">
                <Link href="/login" className="w-full">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup" className="w-full">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-2 rounded-lg bg-white text-purple-800"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
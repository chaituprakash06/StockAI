"use client";

import { createContext, useContext, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to allow login for development when Supabase is not configured
  const devSignIn = async (email: string, password: string) => {
    // For development, accept any credentials
    setUser({ id: '123', email });
    return { error: null };
  };

  // Function to sign up a new user
  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return devSignIn(email, password);
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        // For development, auto-login after signup (no email verification)
        if (!isSupabaseConfigured) {
          setUser({ id: '123', email });
        }
      }
      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign in a user
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return devSignIn(email, password);
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
        }
      }
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out a user
  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
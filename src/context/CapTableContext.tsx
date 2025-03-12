"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Company, Shareholder, Safe, Round } from "@/types/database";

// Context type definition 
interface CapTableContextType {
  // Companies
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
  
  // Shareholders
  shareholders: Shareholder[];
  
  // SAFEs
  safes: Safe[];
  
  // Rounds
  rounds: Round[];
  
  // Loading states
  isLoading: boolean;
  
  // Methods
  createCompany: (name: string) => Promise<Company>;
  addShareholder: (data: Omit<Shareholder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addSafe: (data: Omit<Safe, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addRound: (data: Omit<Round, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CapTableContext = createContext<CapTableContextType | undefined>(undefined);

export function CapTableProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [safes, setSafes] = useState<Safe[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data when user changes or current company changes
  useEffect(() => {
    if (user) {
      fetchCompanies();
    } else {
      // Reset state when user logs out
      setCompanies([]);
      setCurrentCompany(null);
      setShareholders([]);
      setSafes([]);
      setRounds([]);
    }
  }, [user]);
  
  useEffect(() => {
    if (currentCompany) {
      fetchCompanyData(currentCompany.id);
    } else {
      setShareholders([]);
      setSafes([]);
      setRounds([]);
    }
  }, [currentCompany]);
  
  // Fetch companies for the current user
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCompanies(data || []);
      
      // Set current company to the first one if none is selected
      if (data && data.length > 0 && !currentCompany) {
        setCurrentCompany(data[0]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch all data for the current company
  const fetchCompanyData = async (companyId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch shareholders
      const { data: shareholdersData, error: shareholdersError } = await supabase
        .from('shareholders')
        .select('*')
        .eq('company_id', companyId)
        .order('shares', { ascending: false });
      
      if (shareholdersError) throw shareholdersError;
      setShareholders(shareholdersData || []);
      
      // Fetch SAFEs
      const { data: safesData, error: safesError } = await supabase
        .from('safes')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (safesError) throw safesError;
      setSafes(safesData || []);
      
      // Fetch rounds
      const { data: roundsData, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (roundsError) throw roundsError;
      setRounds(roundsData || []);
      
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new company
  const createCompany = async (name: string): Promise<Company> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update companies list
      setCompanies(prevCompanies => [data, ...prevCompanies]);
      
      // Set as current company
      setCurrentCompany(data);
      
      return data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a shareholder
  const addShareholder = async (data: Omit<Shareholder, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data: newShareholder, error } = await supabase
        .from('shareholders')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      setShareholders(prev => [...prev, newShareholder]);
    } catch (error) {
      console.error('Error adding shareholder:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a SAFE
  const addSafe = async (data: Omit<Safe, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data: newSafe, error } = await supabase
        .from('safes')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      setSafes(prev => [...prev, newSafe]);
    } catch (error) {
      console.error('Error adding SAFE:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a round
  const addRound = async (data: Omit<Round, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data: newRound, error } = await supabase
        .from('rounds')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      setRounds(prev => [...prev, newRound]);
    } catch (error) {
      console.error('Error adding round:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh all data for the current company
  const refreshData = async () => {
    if (currentCompany) {
      await fetchCompanyData(currentCompany.id);
    }
  };
  
  return (
    <CapTableContext.Provider 
      value={{ 
        companies,
        currentCompany,
        setCurrentCompany,
        shareholders,
        safes,
        rounds,
        isLoading,
        createCompany,
        addShareholder,
        addSafe,
        addRound,
        refreshData
      }}
    >
      {children}
    </CapTableContext.Provider>
  );
}

export function useCapTable() {
  const context = useContext(CapTableContext);
  if (context === undefined) {
    throw new Error("useCapTable must be used within a CapTableProvider");
  }
  return context;
}
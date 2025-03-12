// lib/db-api.ts
import { supabase } from './supabase';
import { Company, Shareholder, Safe, Round } from '@/types/database';

// Companies
export async function getCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Company[];
}

export async function getCompany(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Company;
}

export async function createCompany(name: string) {
  const { data, error } = await supabase
    .from('companies')
    .insert([{ name }])
    .select()
    .single();
  
  if (error) throw error;
  return data as Company;
}

// Shareholders
export async function getShareholders(companyId: string) {
  const { data, error } = await supabase
    .from('shareholders')
    .select('*')
    .eq('company_id', companyId)
    .order('shares', { ascending: false });
  
  if (error) throw error;
  return data as Shareholder[];
}

export async function createShareholder(shareholder: Omit<Shareholder, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('shareholders')
    .insert([shareholder])
    .select()
    .single();
  
  if (error) throw error;
  return data as Shareholder;
}

// SAFEs
export async function getSafes(companyId: string) {
  const { data, error } = await supabase
    .from('safes')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as Safe[];
}

export async function createSafe(safe: Omit<Safe, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('safes')
    .insert([safe])
    .select()
    .single();
  
  if (error) throw error;
  return data as Safe;
}

// Rounds
export async function getRounds(companyId: string) {
  const { data, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Round[];
}

export async function createRound(round: Omit<Round, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('rounds')
    .insert([round])
    .select()
    .single();
  
  if (error) throw error;
  return data as Round;
}
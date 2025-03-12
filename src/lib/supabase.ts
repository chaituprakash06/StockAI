// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid environment variables
const hasValidConfig = 
  typeof supabaseUrl === 'string' && 
  typeof supabaseAnonKey === 'string' && 
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 0;

// Create a mock client if not configured
const createMockClient = () => {
  // Create a mock client with methods that return empty values or error
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        }),
      }),
    }),
  };
};

// Create the Supabase client or a mock if not configured
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockClient() as any;

// Export flag to indicate if Supabase is properly configured
export const isSupabaseConfigured = hasValidConfig;

// Log a warning if Supabase is not configured
if (!hasValidConfig && typeof window !== 'undefined') {
  console.warn(
    'Supabase environment variables are missing or invalid. Authentication and database features will not work properly. ' +
    'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
  );
}
// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ProsperNest - Family Finance Dashboard
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emokmijrrszycoukqpks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2ttaWpycnN6eWNvdWtxcGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzI1ODAsImV4cCI6MjA3OTc0ODU4MH0.laSAeco8Lqd-U7eWEES9NEyf97K2SQGlGjI';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

// Helper to get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

export default supabase;

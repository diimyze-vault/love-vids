
import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key. Authentication will not work.');
}

// Debug: Log partial connection info (Safe to view in Console)
const urlStart = supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'MISSING';
const keyStart = supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + '...' : 'MISSING';
console.log(`[Supabase Init] URL: ${urlStart}, Key: ${keyStart}`);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});

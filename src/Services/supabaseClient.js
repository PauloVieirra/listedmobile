import { createClient } from '@supabase/supabase-js';

// Acesse suas variáveis de ambiente diretamente
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Anon Key are required.');
}

// Crie o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseClientSingleton = () => {
  if(!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("Db credentials not found");
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
};

type SupabaseClientSingleton = ReturnType<typeof supabaseClientSingleton>;

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClientSingleton | undefined;
};

const supabase = globalForSupabase.supabase ?? supabaseClientSingleton();

if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase;

export default supabase; 
import { API_PATTERNS } from "./constant";
import supabase from "./db";

export const isPotentialAPIRequest = (response: string): boolean => {
  const patterns = Object.values(API_PATTERNS);
  const matchCount = patterns.reduce((count, pattern) =>
    count + (pattern.test(response) ? 1 : 0), 0);

  return matchCount >= 1;
};

export async function initializeDatabase() {
  try {
    const { error } = await supabase.rpc('init_vector_store');
    if (error) throw error;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return;
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
} 


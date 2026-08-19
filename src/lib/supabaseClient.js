import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase env vars missing. Create a .env file — see .env.example')
} else {
  // Log masked values to help debugging without exposing keys in logs
  try {
    const maskedKey = SUPABASE_ANON_KEY.slice(0, 6) + '...' + SUPABASE_ANON_KEY.slice(-6)
    console.debug(`[supabase] URL=${SUPABASE_URL} ANON_KEY=${maskedKey}`)
  } catch (e) {
    // ignore
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Supabase Client for Client-Side (Browser) Use
 *
 * This client uses the ANON key and respects RLS policies.
 * Use this for:
 * - Client Components
 * - Reading data that's allowed by RLS
 *
 * DO NOT use for mutations (INSERT/UPDATE/DELETE) - use Server Actions instead!
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

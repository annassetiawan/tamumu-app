/**
 * Supabase Client for Server-Side Use
 *
 * This file provides two types of Supabase clients:
 *
 * 1. createServerClient() - For Server Components and reading data
 *    - Uses ANON key
 *    - Respects RLS policies
 *    - Gets user session from cookies
 *
 * 2. createServiceRoleClient() - For Server Actions and mutations
 *    - Uses SERVICE_ROLE key (bypasses RLS)
 *    - ONLY use in Server Actions for INSERT/UPDATE/DELETE
 *    - Manually enforce security checks in your code
 */

import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Server Client (for reading data in Server Components)
 * Uses ANON key - respects RLS
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Service Role Client (for mutations in Server Actions)
 * Uses SERVICE_ROLE key - BYPASSES RLS!
 *
 * IMPORTANT: Only use this in Server Actions.
 * Always manually check that the user has permission to perform the action!
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

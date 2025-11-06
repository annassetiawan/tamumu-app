'use server'

/**
 * Check-in Server Actions
 *
 * Handles QR code scanning and guest check-in.
 */

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Check in a guest using their QR token
 */
export async function checkInGuest(qrToken: string, weddingId: string) {
  // Get current user and verify they own this wedding
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.organization_id) {
    return { error: 'Organization not found' }
  }

  // Verify wedding belongs to user's organization
  const { data: wedding } = await supabase
    .from('weddings')
    .select('organization_id, slug')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.organization_id !== profile.organization_id) {
    return { error: 'Wedding not found or unauthorized' }
  }

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Find guest by QR token and wedding_id (double security)
  const { data: guest, error: findError } = await serviceSupabase
    .from('guests')
    .select('*')
    .eq('qr_token', qrToken)
    .eq('wedding_id', weddingId)
    .single()

  if (findError || !guest) {
    return { error: 'QR code tidak valid atau tamu tidak ditemukan' }
  }

  // Check if already checked in
  if (guest.status === 'checked_in') {
    return {
      error: 'Tamu sudah check-in sebelumnya',
      guest: {
        name: guest.name,
        status: guest.status,
        checked_in_at: guest.checked_in_at,
      }
    }
  }

  // Update guest status to checked_in
  const { error: updateError } = await serviceSupabase
    .from('guests')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
    })
    .eq('id', guest.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath(`/dashboard/events/${wedding.slug}`)
  revalidatePath(`/dashboard/events/${wedding.slug}/check-in`)

  return {
    success: true,
    guest: {
      name: guest.name,
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
    }
  }
}

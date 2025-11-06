'use server'

/**
 * Guest Server Actions
 *
 * These handle CRUD operations for guests using the service_role client.
 * Security is enforced by verifying the wedding belongs to the user's organization.
 */

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema
const guestSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  contact: z.string().optional(),
})

/**
 * Verify wedding ownership (security check)
 */
async function verifyWeddingOwnership(weddingId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.organization_id) {
    return { authorized: false, error: 'Organization not found' }
  }

  // Verify wedding belongs to user's organization
  const { data: wedding } = await supabase
    .from('weddings')
    .select('organization_id, slug')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.organization_id !== profile.organization_id) {
    return { authorized: false, error: 'Wedding not found or unauthorized' }
  }

  return { authorized: true, weddingSlug: wedding.slug }
}

/**
 * Create a new guest
 */
export async function createGuest(weddingId: string, formData: FormData) {
  // Security check
  const ownership = await verifyWeddingOwnership(weddingId)
  if (!ownership.authorized) {
    return { error: ownership.error }
  }

  // Validate input
  const validatedFields = guestSchema.safeParse({
    name: formData.get('name'),
    contact: formData.get('contact'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Insert guest
  const { error } = await serviceSupabase
    .from('guests')
    .insert({
      wedding_id: weddingId,
      name: data.name,
      contact: data.contact || null,
      status: 'pending',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/events/${ownership.weddingSlug}`)
  return { success: true }
}

/**
 * Update an existing guest
 */
export async function updateGuest(guestId: string, weddingId: string, formData: FormData) {
  // Security check
  const ownership = await verifyWeddingOwnership(weddingId)
  if (!ownership.authorized) {
    return { error: ownership.error }
  }

  // Validate input
  const validatedFields = guestSchema.safeParse({
    name: formData.get('name'),
    contact: formData.get('contact'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Update guest
  const { error } = await serviceSupabase
    .from('guests')
    .update({
      name: data.name,
      contact: data.contact || null,
    })
    .eq('id', guestId)
    .eq('wedding_id', weddingId) // Extra safety check

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/events/${ownership.weddingSlug}`)
  return { success: true }
}

/**
 * Delete a guest
 */
export async function deleteGuest(guestId: string, weddingId: string) {
  // Security check
  const ownership = await verifyWeddingOwnership(weddingId)
  if (!ownership.authorized) {
    return { error: ownership.error }
  }

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Delete guest
  const { error } = await serviceSupabase
    .from('guests')
    .delete()
    .eq('id', guestId)
    .eq('wedding_id', weddingId) // Extra safety check

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/events/${ownership.weddingSlug}`)
  return { success: true }
}

/**
 * Export guests to CSV
 */
export async function exportGuestsToCSV(weddingId: string) {
  // Security check
  const ownership = await verifyWeddingOwnership(weddingId)
  if (!ownership.authorized) {
    return { error: ownership.error }
  }

  // Fetch all guests for this wedding
  const supabase = await createServerClient()
  const { data: guests, error } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('created_at', { ascending: true })

  if (error || !guests) {
    return { error: 'Failed to fetch guests' }
  }

  // Get wedding details for the invitation URL
  const { data: wedding } = await supabase
    .from('weddings')
    .select('slug')
    .eq('id', weddingId)
    .single()

  if (!wedding) {
    return { error: 'Wedding not found' }
  }

  // Generate CSV content
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const csvHeader = 'Nama,Kontak,Status,Link Undangan,QR Token\n'
  const csvRows = guests.map((guest) => {
    const inviteUrl = `${baseUrl}/invite/${wedding.slug}?guest_id=${guest.id}`
    return `"${guest.name}","${guest.contact || ''}","${guest.status}","${inviteUrl}","${guest.qr_token}"`
  }).join('\n')

  const csvContent = csvHeader + csvRows

  return { success: true, csv: csvContent }
}

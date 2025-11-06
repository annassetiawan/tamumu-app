'use server'

/**
 * RSVP Server Actions
 *
 * Handles guest RSVP submissions from the public invitation page.
 * Uses service_role client as guests are not authenticated.
 */

import { createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema
const rsvpSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  message: z.string().optional(),
})

/**
 * Submit RSVP for a guest
 */
export async function submitRSVP(guestId: string, weddingSlug: string, formData: FormData) {
  // Validate input
  const validatedFields = rsvpSchema.safeParse({
    name: formData.get('name'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  // Use service_role client (guest is not authenticated)
  const serviceSupabase = createServiceRoleClient()

  // Update guest status to confirmed_rsvp
  const { error } = await serviceSupabase
    .from('guests')
    .update({
      name: data.name, // Allow guest to update their name
      status: 'confirmed_rsvp',
      rsvp_message: data.message || null,
      rsvp_at: new Date().toISOString(),
    })
    .eq('id', guestId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/invite/${weddingSlug}`)
  return { success: true }
}

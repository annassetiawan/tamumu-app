'use server'

/**
 * Wedding (Event) Server Actions
 *
 * These handle CRUD operations for weddings using the service_role client
 * to bypass RLS. Security is enforced by checking the user's organization.
 */

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema
const weddingSchema = z.object({
  name: z.string().min(3, 'Nama acara minimal 3 karakter'),
  wedding_date: z.string().optional(),
  slug: z.string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  venue: z.string().optional(),
  venue_address: z.string().optional(),
})

/**
 * Create a new wedding/event
 */
export async function createWedding(formData: FormData) {
  // Get current user and their organization
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

  // Validate input
  const validatedFields = weddingSchema.safeParse({
    name: formData.get('name'),
    wedding_date: formData.get('wedding_date'),
    slug: formData.get('slug'),
    venue: formData.get('venue'),
    venue_address: formData.get('venue_address'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Insert wedding
  const { error } = await serviceSupabase
    .from('weddings')
    .insert({
      organization_id: profile.organization_id, // KEY: Ensures multi-tenant isolation
      name: data.name,
      wedding_date: data.wedding_date || null,
      slug: data.slug,
      venue: data.venue || null,
      venue_address: data.venue_address || null,
    })

  if (error) {
    // Handle duplicate slug error
    if (error.code === '23505') {
      return { error: 'Slug sudah digunakan, silakan pilih slug lain' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Update an existing wedding
 */
export async function updateWedding(weddingId: string, formData: FormData) {
  // Get current user and their organization
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

  // Verify wedding belongs to user's organization (security check)
  const { data: wedding } = await supabase
    .from('weddings')
    .select('organization_id')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.organization_id !== profile.organization_id) {
    return { error: 'Wedding not found or unauthorized' }
  }

  // Validate input
  const validatedFields = weddingSchema.safeParse({
    name: formData.get('name'),
    wedding_date: formData.get('wedding_date'),
    slug: formData.get('slug'),
    venue: formData.get('venue'),
    venue_address: formData.get('venue_address'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Update wedding
  const { error } = await serviceSupabase
    .from('weddings')
    .update({
      name: data.name,
      wedding_date: data.wedding_date || null,
      slug: data.slug,
      venue: data.venue || null,
      venue_address: data.venue_address || null,
    })
    .eq('id', weddingId)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Slug sudah digunakan, silakan pilih slug lain' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/events/${data.slug}`)
  return { success: true }
}

/**
 * Delete a wedding
 */
export async function deleteWedding(weddingId: string) {
  // Get current user and their organization
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

  // Verify wedding belongs to user's organization (security check)
  const { data: wedding } = await supabase
    .from('weddings')
    .select('organization_id')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.organization_id !== profile.organization_id) {
    return { error: 'Wedding not found or unauthorized' }
  }

  // Use service_role client to bypass RLS
  const serviceSupabase = createServiceRoleClient()

  // Delete wedding (CASCADE will delete all guests)
  const { error } = await serviceSupabase
    .from('weddings')
    .delete()
    .eq('id', weddingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

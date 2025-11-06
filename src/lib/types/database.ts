/**
 * Database Types
 *
 * These match our Supabase schema
 */

export type GuestStatus = 'pending' | 'confirmed_rsvp' | 'checked_in'

export type UserRole = 'owner' | 'member'

export interface Organization {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Wedding {
  id: string
  organization_id: string
  name: string
  wedding_date: string | null
  slug: string
  venue: string | null
  venue_address: string | null
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  wedding_id: string
  name: string
  contact: string | null
  status: GuestStatus
  qr_token: string
  rsvp_message: string | null
  rsvp_at: string | null
  checked_in_at: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface WeddingWithGuests extends Wedding {
  guests?: Guest[]
}

export interface GuestWithWedding extends Guest {
  wedding?: Wedding
}

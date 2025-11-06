-- ============================================================================
-- Mitra Undangan - Database Schema
-- ============================================================================
-- Run this entire file in your Supabase SQL Editor to set up the database
--
-- This creates:
-- 1. All tables (organizations, profiles, weddings, guests)
-- 2. RLS (Row Level Security) policies
-- 3. Triggers for auto-creating organization on signup
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Table: organizations (Tenant / WO)
-- Each Wedding Organizer is an organization
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: profiles (User metadata)
-- Links users to their organization
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner' or 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: weddings (Events / Sub-Tenant)
-- Each wedding/event belongs to an organization
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Pernikahan Andi & Budi"
  wedding_date TIMESTAMPTZ,
  slug TEXT UNIQUE NOT NULL, -- for public URL: /invite/slug
  venue TEXT, -- Location/venue name
  venue_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: guests (Core data)
-- Each guest belongs to a specific wedding
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  contact TEXT, -- WhatsApp number or email
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed_rsvp', 'checked_in'
  qr_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT, -- For QR code
  rsvp_message TEXT, -- Optional message from guest
  rsvp_at TIMESTAMPTZ, -- When they RSVP'd
  checked_in_at TIMESTAMPTZ, -- When they checked in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES (for better query performance)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_weddings_org ON public.weddings(organization_id);
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);
CREATE INDEX IF NOT EXISTS idx_guests_wedding ON public.guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_qr_token ON public.guests(qr_token);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Defense-in-Depth Architecture:
-- - RLS allows SELECT (read) only
-- - All mutations (INSERT/UPDATE/DELETE) blocked at RLS level
-- - Mutations must go through Server Actions with service_role key
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only read their own organization
CREATE POLICY "Users can read own organization"
  ON public.organizations
  FOR SELECT
  USING (
    auth.uid() = owner_id
    OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE organization_id = organizations.id
    )
  );

-- Profiles: Users can read own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Weddings: Users can read weddings from their organization
CREATE POLICY "Users can read organization weddings"
  ON public.weddings
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Guests: Users can read guests from their organization's weddings
CREATE POLICY "Users can read organization guests"
  ON public.guests
  FOR SELECT
  USING (
    wedding_id IN (
      SELECT id FROM public.weddings
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Auto-create organization and profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create a new organization for this user
  INSERT INTO public.organizations (name, owner_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) || '''s Organization',
    NEW.id
  )
  RETURNING id INTO new_org_id;

  -- Create a profile linking the user to their new organization
  INSERT INTO public.profiles (id, organization_id, role)
  VALUES (NEW.id, new_org_id, 'owner');

  RETURN NEW;
END;
$$;

-- Trigger: Call handle_new_user after user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. UPDATED_AT TRIGGERS (auto-update timestamp on row changes)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_weddings
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_guests
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- DONE!
-- ============================================================================
-- Your database is now set up with:
-- ✅ All tables created
-- ✅ RLS enabled (read-only for authenticated users)
-- ✅ Auto-organization creation on user signup
-- ✅ Proper indexes for performance
--
-- Next steps:
-- 1. Get your Supabase URL and keys from Project Settings
-- 2. Add them to your .env.local file
-- 3. Start building the app!
-- ============================================================================

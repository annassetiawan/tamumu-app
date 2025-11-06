'use client'

/**
 * Toaster Provider
 *
 * Client component wrapper for Sonner Toaster to avoid server/client boundary issues.
 */

import { Toaster } from '@/components/ui/sonner'

export function ToasterProvider() {
  return <Toaster />
}

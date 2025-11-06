'use client'

/**
 * Logout Button Component
 *
 * Client component for handling logout action with proper error handling.
 */

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)

    try {
      const result = await logout()

      if (result?.error) {
        toast.error('Logout gagal', { description: result.error })
      } else {
        toast.success('Berhasil logout')
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      toast.error('Error', { description: 'Terjadi kesalahan saat logout' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
      Logout
    </Button>
  )
}

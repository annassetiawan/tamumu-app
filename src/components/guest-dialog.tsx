'use client'

/**
 * Guest Create/Edit Dialog
 *
 * A reusable dialog component for creating and editing guests.
 */

import { createGuest, updateGuest } from '@/app/actions/guests'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Guest } from '@/lib/types/database'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface GuestDialogProps {
  weddingId: string
  guest?: Guest
  trigger?: React.ReactNode
}

export function GuestDialog({ weddingId, guest, trigger }: GuestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!guest

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = isEditing
        ? await updateGuest(guest.id, weddingId, formData)
        : await createGuest(weddingId, formData)

      if (result.error) {
        setError(typeof result.error === 'string' ? result.error : 'Terjadi kesalahan')
      } else {
        setOpen(false)
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tamu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tamu' : 'Tambah Tamu Baru'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi tamu'
              : 'Tambahkan tamu baru ke daftar undangan'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              defaultValue={guest?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Kontak (WhatsApp/Email)</Label>
            <Input
              id="contact"
              name="contact"
              placeholder="+62812345678 atau email@example.com"
              defaultValue={guest?.contact || ''}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : isEditing ? 'Simpan' : 'Tambah Tamu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

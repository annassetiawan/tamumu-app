'use client'

/**
 * Wedding Create/Edit Dialog
 *
 * A reusable dialog component for creating and editing weddings.
 * Uses React Hook Form for form handling.
 */

import { createWedding, updateWedding } from '@/app/actions/weddings'
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
import { Textarea } from '@/components/ui/textarea'
import { Wedding } from '@/lib/types/database'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface WeddingDialogProps {
  wedding?: Wedding
  trigger?: React.ReactNode
}

export function WeddingDialog({ wedding, trigger }: WeddingDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!wedding

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = isEditing
        ? await updateWedding(wedding.id, formData)
        : await createWedding(formData)

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

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Acara Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Acara' : 'Buat Acara Baru'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi acara pernikahan'
              : 'Buat acara pernikahan baru untuk klien Anda'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Acara *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Pernikahan Andi & Budi"
              defaultValue={wedding?.name}
              required
              onChange={(e) => {
                // Auto-generate slug from name
                const slugInput = document.getElementById('slug') as HTMLInputElement
                if (!isEditing && slugInput) {
                  slugInput.value = generateSlug(e.target.value)
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (untuk URL) *</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="pernikahan-andi-budi"
              defaultValue={wedding?.slug}
              required
            />
            <p className="text-xs text-gray-500">
              URL undangan: /invite/slug-anda
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wedding_date">Tanggal Acara</Label>
            <Input
              id="wedding_date"
              name="wedding_date"
              type="datetime-local"
              defaultValue={wedding?.wedding_date ? new Date(wedding.wedding_date).toISOString().slice(0, 16) : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Nama Venue</Label>
            <Input
              id="venue"
              name="venue"
              placeholder="Ballroom Hotel XYZ"
              defaultValue={wedding?.venue || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue_address">Alamat Venue</Label>
            <Textarea
              id="venue_address"
              name="venue_address"
              placeholder="Jl. Contoh No. 123, Jakarta"
              defaultValue={wedding?.venue_address || ''}
              rows={3}
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
              {loading ? 'Menyimpan...' : isEditing ? 'Simpan' : 'Buat Acara'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

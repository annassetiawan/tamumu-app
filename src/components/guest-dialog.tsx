'use client'

/**
 * Guest Create/Edit Dialog
 *
 * A reusable dialog component for creating and editing guests.
 * Uses React Hook Form + Zod validation with shadcn Form components.
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Guest } from '@/lib/types/database'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Zod schema untuk validasi form
const guestFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama tamu minimal 2 karakter',
  }),
  contact: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true // Optional field
        // Check if it's a valid phone or email
        const phoneRegex = /^[+]?[\d\s-()]+$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return phoneRegex.test(val) || emailRegex.test(val)
      },
      {
        message: 'Kontak harus berupa nomor telepon atau email yang valid',
      }
    ),
})

type GuestFormValues = z.infer<typeof guestFormSchema>

interface GuestDialogProps {
  weddingId: string
  guest?: Guest
  trigger?: React.ReactNode
}

export function GuestDialog({ weddingId, guest, trigger }: GuestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isEditing = !!guest

  // Initialize form with react-hook-form + zod resolver
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: guest?.name || '',
      contact: guest?.contact || '',
    },
  })

  async function onSubmit(values: GuestFormValues) {
    setLoading(true)

    try {
      // Convert form values to FormData untuk server action
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = isEditing
        ? await updateGuest(guest.id, weddingId, formData)
        : await createGuest(weddingId, formData)

      if (result.error) {
        const errorMsg =
          typeof result.error === 'string' ? result.error : 'Terjadi kesalahan'
        toast.error(isEditing ? 'Gagal memperbarui tamu' : 'Gagal menambah tamu', {
          description: errorMsg,
        })
      } else {
        setOpen(false)
        form.reset()
        toast.success(isEditing ? 'Tamu berhasil diperbarui' : 'Tamu berhasil ditambahkan', {
          description: `"${values.name}" telah ${
            isEditing ? 'diperbarui' : 'ditambahkan ke daftar tamu'
          }`,
        })
        router.refresh()
      }
    } catch (err) {
      toast.error('Error', { description: 'Terjadi kesalahan yang tidak terduga' })
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Lengkap */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kontak */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+62812345678 atau email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nomor WhatsApp atau alamat email untuk mengirim undangan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Menyimpan...' : isEditing ? 'Simpan' : 'Tambah Tamu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

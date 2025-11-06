'use client'

/**
 * Wedding Create/Edit Dialog
 *
 * A reusable dialog component for creating and editing weddings.
 * Uses React Hook Form + Zod validation with shadcn Form components.
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
import { Textarea } from '@/components/ui/textarea'
import { Wedding } from '@/lib/types/database'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// Zod schema untuk validasi form
const weddingFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Nama acara minimal 3 karakter',
  }),
  slug: z
    .string()
    .min(3, {
      message: 'Slug minimal 3 karakter',
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)',
    }),
  wedding_date: z.string().optional(),
  venue: z.string().optional(),
  venue_address: z.string().optional(),
})

type WeddingFormValues = z.infer<typeof weddingFormSchema>

interface WeddingDialogProps {
  wedding?: Wedding
  trigger?: React.ReactNode
}

export function WeddingDialog({ wedding, trigger }: WeddingDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isEditing = !!wedding

  // Initialize form with react-hook-form + zod resolver
  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: {
      name: wedding?.name || '',
      slug: wedding?.slug || '',
      wedding_date: wedding?.wedding_date
        ? new Date(wedding.wedding_date).toISOString().slice(0, 16)
        : '',
      venue: wedding?.venue || '',
      venue_address: wedding?.venue_address || '',
    },
  })

  // Auto-generate slug dari nama
  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function onSubmit(values: WeddingFormValues) {
    setLoading(true)

    try {
      // Convert form values to FormData untuk server action
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = isEditing
        ? await updateWedding(wedding.id, formData)
        : await createWedding(formData)

      if (result.error) {
        const errorMsg =
          typeof result.error === 'string' ? result.error : 'Terjadi kesalahan'
        toast.error(isEditing ? 'Gagal memperbarui acara' : 'Gagal membuat acara', {
          description: errorMsg,
        })
      } else {
        setOpen(false)
        form.reset()
        toast.success(isEditing ? 'Acara berhasil diperbarui' : 'Acara berhasil dibuat', {
          description: `"${values.name}" telah ${isEditing ? 'diperbarui' : 'dibuat'}`,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Acara */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Acara</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pernikahan Andi & Budi"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        // Auto-generate slug saat user mengetik nama
                        if (!isEditing) {
                          form.setValue('slug', generateSlug(e.target.value))
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (untuk URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="pernikahan-andi-budi" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL undangan: /invite/{field.value || 'slug-anda'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Acara */}
            <FormField
              control={form.control}
              name="wedding_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Acara</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Ballroom Hotel XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alamat Venue */}
            <FormField
              control={form.control}
              name="venue_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Venue</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jl. Contoh No. 123, Jakarta"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                {loading ? 'Menyimpan...' : isEditing ? 'Simpan' : 'Buat Acara'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

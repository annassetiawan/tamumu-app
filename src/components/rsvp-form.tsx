'use client'

/**
 * RSVP Form Component
 *
 * Client component for handling RSVP submission with React Hook Form + Zod validation.
 */

import { submitRSVP } from '@/app/actions/rsvp'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const rsvpFormSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  message: z.string().optional(),
})

type RSVPFormValues = z.infer<typeof rsvpFormSchema>

interface RSVPFormProps {
  guest: any
  weddingSlug: string
}

export function RSVPForm({ guest, weddingSlug }: RSVPFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: guest.name || '',
      message: '',
    },
  })

  async function onSubmit(values: RSVPFormValues) {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', values.name)
      if (values.message) formData.append('message', values.message)

      const result = await submitRSVP(guest.id, weddingSlug, formData)

      if (result?.error) {
        if (typeof result.error === 'string') {
          toast.error('RSVP gagal', { description: result.error })
        } else {
          const errors = Object.values(result.error).flat()
          toast.error('RSVP gagal', { description: errors[0] })
        }
      } else {
        toast.success('Terima kasih!', {
          description: 'Konfirmasi kehadiran Anda telah kami terima',
        })
        router.refresh()
      }
    } catch (error) {
      toast.error('Error', { description: 'Terjadi kesalahan yang tidak terduga' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ucapan untuk Pengantin (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Selamat atas pernikahan kalian..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Mengirim...' : 'Konfirmasi Kehadiran'}
        </Button>
      </form>
    </Form>
  )
}

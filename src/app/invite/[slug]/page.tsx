import { submitRSVP } from '@/app/actions/rsvp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@supabase/supabase-js'
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ guest_id?: string }>
}) {
  const { slug } = await params
  const { guest_id } = await searchParams

  // Create a Supabase client with anon key for public access
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch wedding details (public data)
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (weddingError || !wedding) {
    notFound()
  }

  // Fetch guest details if guest_id is provided
  let guest = null
  if (guest_id) {
    const { data: guestData } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guest_id)
      .eq('wedding_id', wedding.id)
      .single()

    guest = guestData
  }

  // Check if already RSVP'd
  const hasRSVPd = guest?.status === 'confirmed_rsvp' || guest?.status === 'checked_in'

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {wedding.name}
          </h1>
          <p className="text-lg text-gray-600">
            Anda diundang untuk merayakan hari bahagia kami
          </p>
        </div>

        {/* Event Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detail Acara</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wedding.wedding_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Tanggal & Waktu</p>
                  <p className="text-gray-600">
                    {new Date(wedding.wedding_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
            {wedding.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Lokasi</p>
                  <p className="text-gray-600">{wedding.venue}</p>
                  {wedding.venue_address && (
                    <p className="text-sm text-gray-500 mt-1">{wedding.venue_address}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSVP Form */}
        {guest && (
          <Card>
            <CardHeader>
              <CardTitle>Konfirmasi Kehadiran</CardTitle>
              <CardDescription>
                {hasRSVPd
                  ? 'Terima kasih! Konfirmasi kehadiran Anda telah kami terima.'
                  : 'Mohon konfirmasi kehadiran Anda'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasRSVPd ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      Konfirmasi Berhasil
                    </p>
                    <p className="text-sm text-green-700">
                      Kami menunggu kehadiran Anda di acara kami
                    </p>
                  </div>
                </div>
              ) : (
                <RSVPForm guest={guest} weddingSlug={slug} />
              )}
            </CardContent>
          </Card>
        )}

        {/* No guest_id message */}
        {!guest && (
          <Card>
            <CardHeader>
              <CardTitle>Undangan Anda</CardTitle>
              <CardDescription>
                Link undangan ini memerlukan ID tamu untuk melakukan RSVP.
                Silakan gunakan link yang dikirimkan kepada Anda.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

function RSVPForm({ guest, weddingSlug }: { guest: any; weddingSlug: string }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    return submitRSVP(guest.id, weddingSlug, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={guest.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Ucapan untuk Pengantin (Opsional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Selamat atas pernikahan kalian..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        Konfirmasi Kehadiran
      </Button>
    </form>
  )
}

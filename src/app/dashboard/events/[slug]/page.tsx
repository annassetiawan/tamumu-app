import { getCurrentUserOrganization } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExportCSVButton } from '@/components/export-csv-button'
import { GuestDialog } from '@/components/guest-dialog'
import { GuestQRDialog } from '@/components/guest-qr-dialog'
import { DeleteGuestButton } from '@/components/delete-guest-button'
import { StatusBadge } from '@/components/status-badge'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, MapPin, Pencil } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const userData = await getCurrentUserOrganization()

  if (!userData) {
    redirect('/login')
  }

  const { organization } = userData

  // Fetch wedding details
  const supabase = await createServerClient()
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .eq('organization_id', organization.id)
    .single()

  if (weddingError || !wedding) {
    notFound()
  }

  // Fetch guests for this wedding
  const { data: guests, error: guestsError } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  if (guestsError) {
    console.error('Error fetching guests:', guestsError)
  }

  // Count guests by status
  const guestStats = {
    total: guests?.length || 0,
    pending: guests?.filter((g) => g.status === 'pending').length || 0,
    confirmed: guests?.filter((g) => g.status === 'confirmed_rsvp').length || 0,
    checkedIn: guests?.filter((g) => g.status === 'checked_in').length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{wedding.name}</h1>
            <div className="mt-2 space-y-1">
              {wedding.wedding_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(wedding.wedding_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
              {wedding.venue && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {wedding.venue}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <ExportCSVButton weddingId={wedding.id} weddingName={wedding.name} />
            <Link href={`/dashboard/events/${wedding.slug}/check-in`}>
              <Button variant="outline">
                Check-in App
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tamu</CardDescription>
            <CardTitle className="text-3xl">{guestStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Belum RSVP</CardDescription>
            <CardTitle className="text-3xl">{guestStats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sudah RSVP</CardDescription>
            <CardTitle className="text-3xl">{guestStats.confirmed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sudah Check-in</CardDescription>
            <CardTitle className="text-3xl">{guestStats.checkedIn}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Tamu</CardTitle>
              <CardDescription>Kelola daftar tamu undangan</CardDescription>
            </div>
            <GuestDialog weddingId={wedding.id} />
          </div>
        </CardHeader>
        <CardContent>
          {!guests || guests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Belum ada tamu</p>
              <GuestDialog weddingId={wedding.id} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.contact || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={guest.status} />
                    </TableCell>
                    <TableCell>
                      <GuestQRDialog guest={guest} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <GuestDialog
                          weddingId={wedding.id}
                          guest={guest}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DeleteGuestButton
                          guestId={guest.id}
                          weddingId={wedding.id}
                          guestName={guest.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

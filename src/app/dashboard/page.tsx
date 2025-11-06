import { getCurrentUserOrganization } from '@/app/actions/auth'
import { deleteWedding } from '@/app/actions/weddings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WeddingDialog } from '@/components/wedding-dialog'
import { createServerClient } from '@/lib/supabase/server'
import { Wedding } from '@/lib/types/database'
import { Calendar, MapPin, Pencil, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const userData = await getCurrentUserOrganization()

  if (!userData) {
    redirect('/login')
  }

  const { organization } = userData

  // Fetch weddings for this organization
  const supabase = await createServerClient()
  const { data: weddings, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching weddings:', error)
  }

  // Fetch guest counts for each wedding
  const weddingsWithCounts = weddings ? await Promise.all(
    weddings.map(async (wedding) => {
      const { count } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('wedding_id', wedding.id)

      return { ...wedding, guestCount: count || 0 }
    })
  ) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Acara Saya</h1>
          <p className="text-gray-500">Kelola acara pernikahan klien Anda</p>
        </div>
        <WeddingDialog />
      </div>

      {!weddingsWithCounts || weddingsWithCounts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Belum Ada Acara</CardTitle>
            <CardDescription>
              Mulai dengan membuat acara pernikahan pertama untuk klien Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeddingDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weddingsWithCounts.map((wedding) => (
            <Card key={wedding.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{wedding.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        /invite/{wedding.slug}
                      </code>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <WeddingDialog
                      wedding={wedding}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteWeddingButton weddingId={wedding.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {wedding.wedding_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(wedding.wedding_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
                {wedding.venue && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {wedding.venue}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {wedding.guestCount} tamu
                </div>
                <Link href={`/dashboard/events/${wedding.slug}`}>
                  <Button className="w-full mt-2">
                    Kelola Tamu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function DeleteWeddingButton({ weddingId }: { weddingId: string }) {
  async function handleDelete() {
    'use server'
    if (confirm('Yakin ingin menghapus acara ini? Semua data tamu akan ikut terhapus.')) {
      await deleteWedding(weddingId)
    }
  }

  return (
    <form action={handleDelete}>
      <Button variant="ghost" size="icon" type="submit">
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </form>
  )
}

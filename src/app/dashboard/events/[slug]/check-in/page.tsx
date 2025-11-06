import { getCurrentUserOrganization } from '@/app/actions/auth'
import { QRScanner } from '@/components/qr-scanner'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function CheckInPage({
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

  // Get check-in stats
  const { data: guests } = await supabase
    .from('guests')
    .select('status')
    .eq('wedding_id', wedding.id)

  const stats = {
    total: guests?.length || 0,
    checkedIn: guests?.filter((g) => g.status === 'checked_in').length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/events/${slug}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Acara
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Check-in: {wedding.name}</h1>
          <p className="text-gray-600 mt-2">
            {stats.checkedIn} dari {stats.total} tamu sudah check-in
          </p>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="max-w-2xl">
        <QRScanner weddingId={wedding.id} />
      </div>
    </div>
  )
}

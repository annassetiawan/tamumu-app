import { getCurrentUserOrganization } from '@/app/actions/auth'
import { LogoutButton } from '@/components/logout-button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getCurrentUserOrganization()

  if (!userData) {
    redirect('/login')
  }

  const { user, organization } = userData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Mitra Undangan
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Acara Saya
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{organization.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

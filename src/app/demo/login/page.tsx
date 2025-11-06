import { LoginForm } from '@/components/examples/login-form'

/**
 * Demo Page untuk LoginForm
 *
 * Halaman ini mendemonstrasikan implementasi form shadcn/ui yang benar.
 * Akses di: http://localhost:3000/demo/login
 */

export default function LoginDemoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Mitra Undangan</h1>
          <p className="text-muted-foreground mt-2">
            Contoh implementasi form dengan shadcn/ui
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Test Credentials:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Email: test@example.com</p>
            <p>Password: 123456</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>Form ini menggunakan pattern shadcn/ui yang benar:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ React Hook Form + Zod validation</li>
            <li>✓ FormField, FormItem, FormLabel, FormControl, FormMessage</li>
            <li>✓ Toast notifications</li>
            <li>✓ Loading states</li>
            <li>✓ Semua komponen dari @/components/ui/*</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

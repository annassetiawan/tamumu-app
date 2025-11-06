'use client'

/**
 * Login Page
 *
 * Refactored to use React Hook Form + Zod validation with shadcn Form components.
 */

import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const result = await login(formData)

      if (result?.error) {
        if (typeof result.error === 'string') {
          toast.error('Login gagal', { description: result.error })
        } else {
          const errors = Object.values(result.error).flat()
          toast.error('Login gagal', { description: errors[0] })
        }
      } else {
        toast.success('Login berhasil!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Error', { description: 'Terjadi kesalahan yang tidak terduga' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Masuk ke akun Wedding Organizer Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Login'}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

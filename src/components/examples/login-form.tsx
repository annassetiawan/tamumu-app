'use client'

/**
 * Login Form Example
 *
 * Contoh implementasi form shadcn/ui yang benar dengan:
 * - React Hook Form untuk form handling
 * - Zod untuk validasi schema
 * - Semua komponen shadcn/ui (Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription)
 * - Toast notifications untuk user feedback
 * - Loading states
 *
 * Pattern ini bisa digunakan sebagai reference untuk form lainnya.
 */

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

// 1. Define Zod schema untuk validasi
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(6, { message: 'Password minimal 6 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' }),
})

// 2. Infer TypeScript type dari schema
type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  // 3. Initialize form dengan useForm + zodResolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 4. Handle form submission
  async function onSubmit(values: LoginFormValues) {
    setLoading(true)

    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      console.log('Login values:', values)

      toast.success('Login berhasil!', {
        description: `Selamat datang kembali, ${values.email}`,
      })

      // Reset form setelah berhasil
      form.reset()
    } catch (error) {
      toast.error('Login gagal', {
        description: 'Email atau password salah',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk login ke akun Anda
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* 5. Wrap form dengan Form provider dari shadcn */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 6. Setiap field menggunakan FormField + FormItem pattern */}

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="nama@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Gunakan email yang terdaftar di sistem
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          <a href="#" className="text-primary hover:underline">
            Lupa password?
          </a>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Belum punya akun?{' '}
          <a href="#" className="text-primary hover:underline">
            Daftar sekarang
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}

# Panduan Form Patterns dengan Shadcn/UI

## 📋 Overview

Semua form di aplikasi Mitra Undangan sekarang menggunakan **pattern shadcn/ui yang benar** dengan:

- ✅ **React Hook Form** - Form state management
- ✅ **Zod** - Schema validation
- ✅ **Shadcn UI Components** - Semua komponen dari `@/components/ui/*`
- ✅ **Toast Notifications** - User feedback dengan Sonner
- ✅ **Loading States** - Spinner dan disabled states
- ✅ **Type Safety** - Full TypeScript support

---

## 🎯 Struktur Form yang Benar

### 1. Import Dependencies

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
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
import { Button } from '@/components/ui/button'
```

### 2. Define Zod Schema

```typescript
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(6, { message: 'Password minimal 6 karakter' }),
})

type FormValues = z.infer<typeof formSchema>
```

### 3. Initialize Form

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    password: '',
  },
})
```

### 4. Handle Submission

```typescript
async function onSubmit(values: FormValues) {
  setLoading(true)

  try {
    // Your logic here
    const result = await yourServerAction(values)

    if (result.error) {
      toast.error('Gagal', { description: result.error })
    } else {
      toast.success('Berhasil!')
      form.reset()
    }
  } catch (error) {
    toast.error('Error', { description: 'Terjadi kesalahan' })
  } finally {
    setLoading(false)
  }
}
```

### 5. Render Form

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="nama@example.com" {...field} />
          </FormControl>
          <FormDescription>
            Gunakan email yang terdaftar
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit" disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Menyimpan...' : 'Submit'}
    </Button>
  </form>
</Form>
```

---

## 📁 File yang Sudah Direfactor

### 1. WeddingDialog (`src/components/wedding-dialog.tsx`)

**Validasi:**
- Nama acara: minimal 3 karakter
- Slug: minimal 3 karakter, hanya huruf kecil, angka, dan `-`
- Auto-generate slug dari nama (dengan normalize untuk handle karakter Indonesia)
- Wedding date, venue, venue address: optional

**Fitur:**
- ✅ Auto-generate slug saat user mengetik nama
- ✅ Validasi real-time
- ✅ Error messages dalam Bahasa Indonesia
- ✅ Toast notifications
- ✅ Loading spinner

### 2. GuestDialog (`src/components/guest-dialog.tsx`)

**Validasi:**
- Nama: minimal 2 karakter
- Kontak: optional, validasi format phone atau email

**Fitur:**
- ✅ Validasi format kontak (phone/email)
- ✅ FormDescription untuk panduan user
- ✅ Toast notifications
- ✅ Loading spinner

### 3. LoginForm (`src/components/examples/login-form.tsx`) ⭐ **REFERENCE**

Form contoh yang **lengkap dan ter-dokumentasi** untuk digunakan sebagai template.

**Fitur:**
- ✅ Email validation
- ✅ Password strength validation
- ✅ Icon di input field
- ✅ Loading states
- ✅ Toast notifications
- ✅ Fully commented code

**Demo Page:** `/demo/login`

---

## 🚀 Quick Start: Membuat Form Baru

### Step 1: Copy Template

```bash
# Copy LoginForm sebagai template
cp src/components/examples/login-form.tsx src/components/your-new-form.tsx
```

### Step 2: Sesuaikan Schema

```typescript
const yourFormSchema = z.object({
  fieldName: z.string().min(3, { message: 'Minimal 3 karakter' }),
  // tambahkan field lainnya
})
```

### Step 3: Update Form Fields

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label Anda</FormLabel>
      <FormControl>
        <Input placeholder="Placeholder" {...field} />
      </FormControl>
      <FormDescription>Hint untuk user</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Step 4: Connect Server Action

```typescript
async function onSubmit(values: FormValues) {
  const result = await yourServerAction(values)
  // handle result
}
```

---

## 🎨 Komponen Shadcn/UI yang Tersedia

Semua komponen berikut sudah di-install dan siap digunakan:

| Komponen | Import Path | Kegunaan |
|----------|------------|----------|
| `Form` | `@/components/ui/form` | Form provider |
| `FormField` | `@/components/ui/form` | Field wrapper dengan Controller |
| `FormItem` | `@/components/ui/form` | Item container |
| `FormLabel` | `@/components/ui/form` | Label dengan error styling |
| `FormControl` | `@/components/ui/form` | Control wrapper |
| `FormDescription` | `@/components/ui/form` | Helper text |
| `FormMessage` | `@/components/ui/form` | Error message |
| `Input` | `@/components/ui/input` | Text input |
| `Textarea` | `@/components/ui/textarea` | Multi-line input |
| `Button` | `@/components/ui/button` | Button dengan variants |
| `Dialog` | `@/components/ui/dialog` | Modal dialog |
| `Card` | `@/components/ui/card` | Card container |

---

## 💡 Best Practices

### ✅ DO

- **Selalu gunakan Zod schema** untuk validasi
- **Gunakan FormField pattern** untuk setiap input
- **Tambahkan FormDescription** untuk field yang butuh penjelasan
- **Handle loading states** dengan spinner dan disabled button
- **Show toast notifications** untuk feedback user
- **Reset form** setelah submission berhasil
- **Use TypeScript types** dari zod schema (`z.infer<typeof schema>`)

### ❌ DON'T

- ❌ Jangan pakai `<input>` HTML biasa, gunakan `<Input>` dari shadcn
- ❌ Jangan pakai `<label>` HTML biasa, gunakan `<FormLabel>`
- ❌ Jangan handle validation manual, pakai Zod schema
- ❌ Jangan lupa tambahkan `{...field}` spread di Input
- ❌ Jangan hardcode error messages, define di Zod schema
- ❌ Jangan skip loading states

---

## 🧪 Testing Form

### 1. Jalankan Dev Server

```bash
npm run dev
```

### 2. Akses Demo Page

```
http://localhost:3000/demo/login
```

### 3. Test Validasi

- Coba submit form kosong → Should show error messages
- Coba email invalid → Should show "Format email tidak valid"
- Coba password < 6 char → Should show "Password minimal 6 karakter"
- Submit valid data → Should show loading state then success toast

---

## 📚 Resources

- **LoginForm Example:** `src/components/examples/login-form.tsx`
- **Demo Page:** `src/app/demo/login/page.tsx`
- **Shadcn Form Docs:** https://ui.shadcn.com/docs/components/form
- **React Hook Form:** https://react-hook-form.com/
- **Zod Docs:** https://zod.dev/

---

## 🎯 Komponen Form yang Sudah Ready

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| WeddingDialog | `wedding-dialog.tsx` | ✅ Refactored | Dengan auto-generate slug |
| GuestDialog | `guest-dialog.tsx` | ✅ Refactored | Dengan phone/email validation |
| LoginForm | `examples/login-form.tsx` | ✅ New | Reference implementation |

---

## 🔄 Migration Checklist

Untuk migrate form lama ke pattern baru:

- [ ] Install dependencies: `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Create Zod schema
- [ ] Replace `useState` with `useForm`
- [ ] Replace HTML elements dengan shadcn components
- [ ] Wrap dengan `<Form>` provider
- [ ] Convert each input ke `<FormField>` pattern
- [ ] Add loading states
- [ ] Add toast notifications
- [ ] Test validasi

---

## ❓ FAQ

**Q: Apakah saya harus selalu pakai Zod?**
A: Ya, untuk consistency dan type safety.

**Q: Bagaimana handle custom validation?**
A: Gunakan `.refine()` method di Zod schema (lihat contoh di GuestDialog untuk phone/email validation).

**Q: Bagaimana handle async validation?**
A: Bisa pakai resolver custom atau validasi di `onSubmit` function.

**Q: Apakah bisa pakai Select/Checkbox/Radio?**
A: Ya! Install komponen tersebut dulu dengan `npx shadcn-ui@latest add select` dst, lalu ikuti pattern yang sama.

---

Untuk pertanyaan atau issue, silakan buat issue di repository atau tanyakan pada saya! 🚀

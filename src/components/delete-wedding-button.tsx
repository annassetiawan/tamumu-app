'use client'

/**
 * Delete Wedding Button with Confirmation
 *
 * Uses AlertDialog for confirmation and toast for feedback
 */

import { deleteWedding } from '@/app/actions/weddings'
import { DeleteAlertDialog } from '@/components/delete-alert-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteWeddingButtonProps {
  weddingId: string
  weddingName: string
}

export function DeleteWeddingButton({ weddingId, weddingName }: DeleteWeddingButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteWedding(weddingId)

    if (result.error) {
      toast.error('Gagal menghapus acara', {
        description: result.error,
      })
    } else {
      toast.success('Acara berhasil dihapus', {
        description: `"${weddingName}" telah dihapus`,
      })
      router.refresh()
    }
  }

  return (
    <DeleteAlertDialog
      title="Hapus Acara?"
      description={`Yakin ingin menghapus "${weddingName}"? Semua data tamu akan ikut terhapus. Tindakan ini tidak bisa dibatalkan.`}
      onConfirm={handleDelete}
    />
  )
}

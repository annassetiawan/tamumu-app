'use client'

/**
 * Delete Guest Button with Confirmation
 *
 * Uses AlertDialog for confirmation and toast for feedback
 */

import { deleteGuest } from '@/app/actions/guests'
import { DeleteAlertDialog } from '@/components/delete-alert-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteGuestButtonProps {
  guestId: string
  weddingId: string
  guestName: string
}

export function DeleteGuestButton({ guestId, weddingId, guestName }: DeleteGuestButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteGuest(guestId, weddingId)

    if (result.error) {
      toast.error('Gagal menghapus tamu', {
        description: result.error,
      })
    } else {
      toast.success('Tamu berhasil dihapus', {
        description: `"${guestName}" telah dihapus dari daftar tamu`,
      })
      router.refresh()
    }
  }

  return (
    <DeleteAlertDialog
      title="Hapus Tamu?"
      description={`Yakin ingin menghapus "${guestName}" dari daftar tamu? Tindakan ini tidak bisa dibatalkan.`}
      onConfirm={handleDelete}
    />
  )
}

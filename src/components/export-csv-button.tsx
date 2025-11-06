'use client'

/**
 * Export CSV Button
 *
 * Exports guest list to CSV file
 */

import { exportGuestsToCSV } from '@/app/actions/guests'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

interface ExportCSVButtonProps {
  weddingId: string
  weddingName: string
}

export function ExportCSVButton({ weddingId, weddingName }: ExportCSVButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const result = await exportGuestsToCSV(weddingId)

      if (result.error) {
        alert('Gagal mengekspor data: ' + result.error)
        return
      }

      if (result.csv) {
        // Create blob and download
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `tamu-${weddingName.replace(/\s+/g, '-').toLowerCase()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengekspor data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
    >
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Mengekspor...' : 'Ekspor CSV'}
    </Button>
  )
}

'use client'

/**
 * Guest QR Code Dialog
 *
 * Displays the unique QR code for a guest
 */

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Guest } from '@/lib/types/database'
import { QrCode } from 'lucide-react'
import { QRCodeSVG } from 'react-qr-code'
import { useState } from 'react'

interface GuestQRDialogProps {
  guest: Guest
}

export function GuestQRDialog({ guest }: GuestQRDialogProps) {
  const [open, setOpen] = useState(false)

  function downloadQR() {
    const svg = document.getElementById(`qr-${guest.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${guest.name.replace(/\s+/g, '-').toLowerCase()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Lihat QR Code">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {guest.name}</DialogTitle>
          <DialogDescription>
            QR code unik untuk check-in tamu
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              id={`qr-${guest.id}`}
              value={guest.qr_token}
              size={256}
              level="H"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-mono text-gray-500">
              Token: {guest.qr_token.substring(0, 8)}...
            </p>
          </div>
          <Button onClick={downloadQR} variant="outline" className="w-full">
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

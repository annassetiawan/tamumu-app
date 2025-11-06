'use client'

/**
 * QR Code Scanner Component
 *
 * Uses html5-qrcode to scan QR codes from camera
 */

import { checkInGuest } from '@/app/actions/checkin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  weddingId: string
}

export function QRScanner({ weddingId }: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{
    type: 'success' | 'error'
    message: string
    guest?: { name: string; status: string; checked_in_at?: string }
  } | null>(null)
  const scannerRef = useRef<any>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  async function startScanner() {
    setScanning(true)
    setResult(null)

    // Dynamically import html5-qrcode to avoid SSR issues
    const { Html5QrcodeScanner } = await import('html5-qrcode')

    if (scannerRef.current) {
      scannerRef.current.clear()
    }

    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    )

    scannerRef.current.render(
      async (decodedText: string) => {
        // QR code successfully scanned
        console.log('QR Code scanned:', decodedText)

        // Stop scanner
        if (scannerRef.current) {
          await scannerRef.current.clear()
        }
        setScanning(false)

        // Process check-in
        const result = await checkInGuest(decodedText, weddingId)

        if (result.error) {
          setResult({
            type: 'error',
            message: result.error,
            guest: result.guest,
          })
        } else if (result.success && result.guest) {
          setResult({
            type: 'success',
            message: `${result.guest.name} berhasil check-in!`,
            guest: result.guest,
          })
        }
      },
      (errorMessage: string) => {
        // Ignore scan errors (they happen constantly while scanning)
        console.debug('Scan error:', errorMessage)
      }
    )
  }

  function stopScanner() {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setScanning(false)
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Scanner UI */}
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Arahkan kamera ke QR code tamu untuk check-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!scanning ? (
            <div className="text-center py-8">
              <Button onClick={startScanner} size="lg">
                Mulai Scan
              </Button>
            </div>
          ) : (
            <>
              <div id="qr-reader" ref={videoRef}></div>
              <div className="mt-4 text-center">
                <Button onClick={stopScanner} variant="outline">
                  Hentikan Scan
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className={result.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {result.type === 'success' ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold text-lg ${result.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {result.message}
                </p>
                {result.guest && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Nama:</strong> {result.guest.name}</p>
                    <p><strong>Status:</strong> {result.guest.status}</p>
                    {result.guest.checked_in_at && (
                      <p>
                        <strong>Waktu:</strong>{' '}
                        {new Date(result.guest.checked_in_at).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => {
                  setResult(null)
                  startScanner()
                }}
                className="w-full"
              >
                Scan Tamu Berikutnya
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

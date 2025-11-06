/**
 * Status Badge Component
 *
 * Displays guest status using shadcn Badge component
 */

import { Badge } from '@/components/ui/badge'
import { GuestStatus } from '@/lib/types/database'

interface StatusBadgeProps {
  status: GuestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      label: 'Pending',
      variant: 'secondary' as const,
    },
    confirmed_rsvp: {
      label: 'Confirmed',
      variant: 'info' as const,
    },
    checked_in: {
      label: 'Checked In',
      variant: 'success' as const,
    },
  }

  const { label, variant } = config[status] || config.pending

  return <Badge variant={variant}>{label}</Badge>
}

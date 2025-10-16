import { memo } from 'react'
import { Badge } from '@iqss/dataverse-design-system'

interface UnreadNotificationBadgeProps {
  unreadCount: number
}

const UnreadNotificationBadge = memo(({ unreadCount }: UnreadNotificationBadgeProps) => {
  if (unreadCount === 0) return null
  return (
    <Badge variant="danger" pill dataTestId="unread-notifications-badge" className="ms-1">
      {unreadCount}
    </Badge>
  )
})

UnreadNotificationBadge.displayName = 'UnreadNotificationBadge'

export default UnreadNotificationBadge

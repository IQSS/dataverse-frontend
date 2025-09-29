import { memo } from 'react'
import { Badge } from '@iqss/dataverse-design-system'
import { useNotificationContext } from '@/notifications/context/NotificationsContext'

const UnreadNotificationBadge = memo(() => {
  const { unreadCount } = useNotificationContext()

  if (unreadCount === 0) return null

  return (
    <Badge variant="danger" pill dataTestId="unread-notifications-badge" className="ms-1">
      {unreadCount}
    </Badge>
  )
})
UnreadNotificationBadge.displayName = 'UnreadNotificationBadge'

export default UnreadNotificationBadge

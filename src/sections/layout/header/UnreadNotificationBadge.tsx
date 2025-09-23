import { useNotificationContext } from '@/notifications/context/NotificationsContext'
import styles from './Header.module.scss'
import React from 'react'
const UnreadNotificationBadge = React.memo(() => {
  const { unreadCount } = useNotificationContext()
  if (unreadCount === 0) return null
  return (
    <span
      data-testid="unread-notifications-badge"
      className={styles['unread-notifications-count']}>{` ${unreadCount}`}</span>
  )
})
UnreadNotificationBadge.displayName = 'UnreadNotificationBadge'

export default UnreadNotificationBadge

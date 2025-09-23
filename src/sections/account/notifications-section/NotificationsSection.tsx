import { Button } from '@iqss/dataverse-design-system'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { useTranslation } from 'react-i18next'
import styles from './NotificationsSection.module.scss'
import { useNotificationContext } from '@/notifications/context/NotificationsContext'
import { X } from 'react-bootstrap-icons'

//TODO: add translations

export const NotificationsSection = () => {
  const { t } = useTranslation('account')
  const { notifications, isLoading, error, refetch, markAsRead } = useNotificationContext()
  const handleMarkRead = async (id: number) => {
    await markAsRead([id])
    await refetch()
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Button
          variant="link"
          aria-label={t('Clear All')}
          onClick={async () => {
            const unreadIds = notifications.map((n) => n.id)
            if (unreadIds.length > 0) {
              await markAsRead(unreadIds)
              await refetch()
            }
          }}
          style={{ padding: 0 }}>
          {t('Clear All')}
        </Button>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            className={`${styles['notification-row']} ${
              !notification.displayAsRead ? styles.unread : ''
            }`}
            key={notification.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              variant="link"
              aria-label={t('Mark as read')}
              onClick={async () => {
                await handleMarkRead(notification.id)
              }}
              style={{ padding: 0, marginRight: 8 }}>
              <X />
            </Button>
            <div>{getTranslatedNotification(notification, t)}</div>
          </div>
        ))
      ) : (
        <div>No notifications available.</div>
      )}
    </div>
  )
}

export default NotificationsSection

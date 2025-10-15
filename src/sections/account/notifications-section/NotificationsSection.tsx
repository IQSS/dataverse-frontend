import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CloseButton } from '@iqss/dataverse-design-system'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { useNotificationContext } from '@/notifications/context/NotificationsContext'
import styles from './NotificationsSection.module.scss'

export const NotificationsSection = () => {
  const { t } = useTranslation('account')
  const { notifications, isLoading, error, refetch, markAsRead, deleteMany } =
    useNotificationContext()
  const [readIds, setReadIds] = useState<number[]>([])

  useEffect(() => {
    const unreadIds = notifications
      .filter((n) => !n.displayAsRead && !readIds.includes(n.id))
      .map((n) => n.id)

    if (unreadIds.length > 0) {
      const timer = setTimeout(() => {
        void (async () => {
          await markAsRead(unreadIds)
          setReadIds((prev) => [...prev, ...unreadIds])
          await refetch()
        })()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notifications, readIds, markAsRead, refetch])

  const handleDelete = async (id: number) => {
    await deleteMany([id])
    await refetch()
  }

  const handleClearAll = async () => {
    const ids = notifications.map((n) => n.id)
    if (ids.length > 0) {
      await deleteMany(ids)
      await refetch()
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <section>
      <div className="d-flex align-items-center gap-2 mb-2">
        {notifications.length > 0 && (
          <Button
            size="sm"
            variant="secondary"
            aria-label={t('notifications.clearAll')}
            onClick={handleClearAll}>
            {t('notifications.clearAll')}
          </Button>
        )}
      </div>
      {notifications.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {notifications.map((notification) => {
            const isRead = notification.displayAsRead || readIds.includes(notification.id)
            return (
              <div
                className={`${styles['notification-item']} ${
                  isRead ? styles['read'] : styles['unread']
                }`}
                key={notification.id}>
                <div>
                  {getTranslatedNotification(notification, t)}
                  <span className={styles['timestamp']}>{notification.sentTimestamp}</span>
                </div>
                <CloseButton
                  onClick={async () => {
                    await handleDelete(notification.id)
                  }}
                  aria-label={t('notifications.dismiss')}
                  data-testid={`dismiss-notification-${notification.id}`}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div>{t('notifications.noNotifications')}</div>
      )}
    </section>
  )
}

export default NotificationsSection

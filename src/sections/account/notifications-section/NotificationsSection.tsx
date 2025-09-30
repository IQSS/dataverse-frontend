import { useTranslation } from 'react-i18next'
import { Button, CloseButton } from '@iqss/dataverse-design-system'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { useNotificationContext } from '@/notifications/context/NotificationsContext'
import styles from './NotificationsSection.module.scss'

export const NotificationsSection = () => {
  const { t } = useTranslation('account')
  const { unreadNotifications, isLoading, error, refetch, markAsRead } = useNotificationContext()

  const handleMarkRead = async (id: number) => {
    await markAsRead([id])
    await refetch()
  }

  const handleClearAll = async () => {
    const unreadIds = unreadNotifications.map((n) => n.id)
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds)
      await refetch()
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <section>
      <div className="d-flex align-items-center gap-2 mb-2">
        {unreadNotifications.length > 0 && (
          <Button
            size="sm"
            variant="secondary"
            aria-label={t('notifications.clearAll')}
            onClick={handleClearAll}>
            {t('notifications.clearAll')}
          </Button>
        )}
      </div>
      {unreadNotifications.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {unreadNotifications.map((notification) => (
            <div className={styles['notification-item']} key={notification.id}>
              <div>
                {getTranslatedNotification(notification, t)}
                <span className={styles['timestamp']}>{notification.sentTimestamp}</span>
              </div>
              <CloseButton
                onClick={async () => {
                  await handleMarkRead(notification.id)
                }}
                aria-label={t('notifications.dismiss')}
                data-testid={`dismiss-notification-${notification.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>{t('notifications.noNotifications')}</div>
      )}
    </section>
  )
}

export default NotificationsSection

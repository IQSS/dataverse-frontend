import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { useGetNotifications } from '@/sections/account/notifications-section/useGetNotifications'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { useTranslation } from 'react-i18next'
interface NotificationsSectionProps {
  repository: NotificationRepository
}

export const NotificationsSection = ({ repository }: NotificationsSectionProps) => {
  const { t } = useTranslation('account')
  const { notifications, isLoading, error } = useGetNotifications(repository)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id}>{getTranslatedNotification(notification, t)}</div>
        ))
      ) : (
        <div>No notifications available.</div>
      )}
    </div>
  )
}

export default NotificationsSection

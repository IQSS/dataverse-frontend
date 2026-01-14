import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CloseButton, Stack } from '@iqss/dataverse-design-system'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { needsUpdateStore } from '@/notifications/domain/hooks/needsUpdateStore'
import { useNotifications } from '@/notifications/domain/hooks/useNotifications'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { PaginationControls } from '@/sections/shared/pagination/PaginationControls'
import styles from './NotificationsSection.module.scss'
import { DateHelper } from '@/shared/helpers/DateHelper'

interface NotificationsSectionProps {
  notificationRepository: NotificationRepository
}

export const NotificationsSection = ({ notificationRepository }: NotificationsSectionProps) => {
  const { t } = useTranslation('account')
  const [paginationInfo, setPaginationInfo] = useState<NotificationsPaginationInfo>(
    new NotificationsPaginationInfo()
  )

  const { notifications, isLoading, error, refetch, markAsRead, deleteMany } = useNotifications(
    notificationRepository,
    paginationInfo,
    setPaginationInfo
  )

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
          needsUpdateStore.setNeedsUpdate(true)
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

  // compute display range
  const total = paginationInfo?.totalItems ?? notifications.length
  const page = Math.max(1, paginationInfo?.page ?? 1)
  const pageSize = Math.max(1, paginationInfo?.pageSize ?? (notifications.length || 1))
  const start = notifications.length === 0 ? 0 : (page - 1) * pageSize + 1
  const end = notifications.length === 0 ? 0 : Math.min(start + notifications.length - 1, total)
  const clearAllKeyTranslation =
    total > pageSize
      ? t('notifications.clearAllOnThisPage')
      : t('notifications.clearAllNotifications')
  return (
    <section>
      <Stack gap={3} style={{ width: '100%' }}>
        <Stack
          direction="horizontal"
          gap={2}
          style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{t('notifications.displayingNotifications', { start, end, total })}</div>

          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              aria-label={clearAllKeyTranslation}
              onClick={handleClearAll}
              disabled={isLoading}>
              {clearAllKeyTranslation}
            </Button>
          )}
        </Stack>

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
                    <span className={styles['timestamp']}>
                      {DateHelper.toDisplayFormatWithTime(new Date(notification.sentTimestamp))}
                    </span>
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
            <PaginationControls
              initialPaginationInfo={paginationInfo}
              onPaginationInfoChange={setPaginationInfo}
            />
          </div>
        ) : (
          <div>{t('notifications.noNotifications')}</div>
        )}
      </Stack>
    </section>
  )
}

export default NotificationsSection

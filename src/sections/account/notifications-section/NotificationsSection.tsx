import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, CloseButton, Stack } from '@iqss/dataverse-design-system'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { useNotifications } from '@/notifications/domain/hooks/useNotifications'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { PaginationControls } from '@/sections/shared/pagination/PaginationControls'
import styles from './NotificationsSection.module.scss'
import { DateHelper } from '@/shared/helpers/DateHelper'
import NotificationSkeleton from '@/sections/account/notifications-section/NotificationsSkeleton'

interface NotificationsSectionProps {
  notificationRepository: NotificationRepository
}

const DELETE_TRANSITION_DURATION_MS = 250

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
  const [deletingIds, setDeletingIds] = useState<number[]>([])

  useEffect(() => {
    const unreadIds = notifications
      .filter((n) => !n.displayAsRead && !readIds.includes(n.id) && !deletingIds.includes(n.id))
      .map((n) => n.id)
    if (unreadIds.length > 0) {
      const timer = setTimeout(() => {
        void (async () => {
          await markAsRead(unreadIds)
          setReadIds((prev) => Array.from(new Set([...prev, ...unreadIds])))
          await refetch(true)
        })()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notifications, readIds, deletingIds, markAsRead, refetch])

  const removeNotifications = async (ids: number[]) => {
    const idsToDelete = Array.from(new Set(ids)).filter((id) => !deletingIds.includes(id))

    if (idsToDelete.length === 0) return

    setDeletingIds((prev) => Array.from(new Set([...prev, ...idsToDelete])))

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, DELETE_TRANSITION_DURATION_MS)
    })

    await deleteMany(idsToDelete)
    setDeletingIds((prev) => prev.filter((id) => !idsToDelete.includes(id)))
    await refetch(true)
  }

  const handleDelete = async (id: number) => {
    await removeNotifications([id])
  }

  const handleClearAll = async () => {
    await removeNotifications(notifications.map((n) => n.id))
  }

  if (isLoading) return <NotificationSkeleton rows={5} />

  if (error) {
    return (
      <Alert variant="danger" dismissible={false}>
        {error}
      </Alert>
    )
  }

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
          {notifications.length > 0 && (
            <div>{t('notifications.displayingNotifications', { start, end, total })}</div>
          )}

          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              aria-label={clearAllKeyTranslation}
              onClick={handleClearAll}
              disabled={isLoading || deletingIds.length > 0}>
              {clearAllKeyTranslation}
            </Button>
          )}
        </Stack>

        {notifications.length > 0 ? (
          <div className={styles['notifications-list']}>
            {notifications.map((notification) => {
              const isRead = notification.displayAsRead || readIds.includes(notification.id)
              const isDeleting = deletingIds.includes(notification.id)
              return (
                <div
                  className={`${styles['notification-item']} ${
                    isRead ? styles['read'] : styles['unread']
                  } ${isDeleting ? styles['deleting'] : ''}`}
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
                    disabled={isDeleting}
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

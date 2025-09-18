import { useState } from 'react'
import { Form } from '@iqss/dataverse-design-system'
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
  const [selected, setSelected] = useState<number[]>([])

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

  const selectAll = () => {
    setSelected(notifications.map((n) => n.id))
  }

  const clearSelection = () => {
    setSelected([])
  }

  // Placeholder handlers for actions
  const handleDelete = () => {
    // Implement delete logic here
    clearSelection()
  }
  const handleMarkRead = () => {
    // Implement mark as read logic here
    clearSelection()
  }
  const handleMarkUnread = () => {
    // Implement mark as unread logic here
    clearSelection()
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Form.Group.Checkbox
          id="select-all"
          label={'Select All'}
          checked={selected.length === notifications.length && notifications.length > 0}
          onChange={(e) => (e.target.checked ? selectAll() : clearSelection())}
          aria-label={t('Select All')}
        />
        <span>{t('Select All')}</span>
        <button onClick={handleDelete} disabled={selected.length === 0} title="Delete">
          🗑️
        </button>
        <button onClick={handleMarkRead} disabled={selected.length === 0} title="Mark as read">
          📖
        </button>
        <button onClick={handleMarkUnread} disabled={selected.length === 0} title="Mark as unread">
          ✉️
        </button>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Form.Group.Checkbox
              id={`select-${notification.id}`}
              label=""
              aria-label={t('Select notification')}
              checked={selected.includes(notification.id)}
              onChange={() => toggleSelect(notification.id)}
            />
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

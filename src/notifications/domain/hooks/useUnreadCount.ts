import { useCallback, useEffect, useState } from 'react'
import { needsUpdateStore } from './needsUpdateStore'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { User } from '@/users/domain/models/User'
import { useNeedsUpdate } from '@/notifications/domain/hooks/useNeedsUpdate'
import { getUnreadNotificationsCount } from '@/notifications/domain/useCases/getUnreadNotificationsCount'

const POLLING_INTERVAL = 30000 // 30 seconds
export function useUnreadCount(user: User, notificationRepository: NotificationRepository) {
  const [unreadCount, setUnreadCount] = useState(0)

  const needsUpdate = useNeedsUpdate()
  const fetchUnread = useCallback(async () => {
    if (user) {
      const count = await getUnreadNotificationsCount(notificationRepository)
      setUnreadCount(count)
    }
    needsUpdateStore.setNeedsUpdate(false)
  }, [user, notificationRepository])
  useEffect(() => {
    if (needsUpdate) {
      void fetchUnread()
    }
  }, [needsUpdate, fetchUnread, notificationRepository])
  // Polling trigger
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchUnread()
    }, POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchUnread, notificationRepository])

  useEffect(() => {
    void fetchUnread() // run once when the component mounts
  }, [fetchUnread])

  return unreadCount
}

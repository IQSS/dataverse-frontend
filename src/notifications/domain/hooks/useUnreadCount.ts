import { useEffect, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { needsUpdateStore } from './needsUpdateStore'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'

const POLLING_INTERVAL = 30000 // 30 seconds
export function useUnreadCount(repository: NotificationRepository) {
  const [unreadCount, setUnreadCount] = useState(0)

  const needsUpdate = useSyncExternalStore(needsUpdateStore.subscribe, needsUpdateStore.getSnapshot)
  const fetchUnread = async () => {
    const count = await repository.getUnreadNotificationsCount()
    setUnreadCount(count)
    needsUpdateStore.setNeedsUpdate(false)
  }
  useEffect(() => {
    if (needsUpdate) {
      void fetchUnread()
    }
  }, [needsUpdate, fetchUnread, repository])
  // Polling trigger
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchUnread()
    }, POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchUnread, repository])

  useEffect(() => {
    void fetchUnread() // run once when the component mounts
  }, [fetchUnread])

  return unreadCount
}

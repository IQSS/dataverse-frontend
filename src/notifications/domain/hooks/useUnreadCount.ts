import { useCallback, useEffect, useRef, useState } from 'react'
import { needsUpdateStore } from './needsUpdateStore'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { User } from '@/users/domain/models/User'
import { useNeedsUpdate } from '@/notifications/domain/hooks/useNeedsUpdate'
import { getUnreadNotificationsCount } from '@/notifications/domain/useCases/getUnreadNotificationsCount'

const POLLING_INTERVAL = 30000 // 30 seconds
const INVALIDATION_RETRY_INTERVAL = 1000
const INVALIDATION_RETRY_ATTEMPTS = 6
export function useUnreadCount(user: User, notificationRepository: NotificationRepository) {
  const [unreadCount, setUnreadCount] = useState(0)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refreshCycleRef = useRef(0)

  const needsUpdate = useNeedsUpdate()

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  const fetchUnread = useCallback(
    async (refreshCycleId?: number) => {
      if (user) {
        const count = await getUnreadNotificationsCount(notificationRepository)
        if (refreshCycleId === undefined || refreshCycleRef.current === refreshCycleId) {
          setUnreadCount(count)
        }
      }
    },
    [user, notificationRepository]
  )

  useEffect(() => {
    if (needsUpdate) {
      const refreshCycleId = refreshCycleRef.current + 1
      refreshCycleRef.current = refreshCycleId
      clearRetryTimeout()
      needsUpdateStore.setNeedsUpdate(false)

      const runRefreshCycle = async (attempt: number) => {
        await fetchUnread(refreshCycleId)

        if (refreshCycleRef.current !== refreshCycleId) {
          return
        }

        if (attempt < INVALIDATION_RETRY_ATTEMPTS - 1) {
          retryTimeoutRef.current = setTimeout(() => {
            void runRefreshCycle(attempt + 1)
          }, INVALIDATION_RETRY_INTERVAL)
        }
      }

      void runRefreshCycle(0)
    }
  }, [needsUpdate, fetchUnread, clearRetryTimeout])

  // Polling trigger
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchUnread()
    }, POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchUnread])

  useEffect(() => {
    void fetchUnread() // run once when the component mounts
  }, [fetchUnread])

  useEffect(() => clearRetryTimeout, [clearRetryTimeout])

  return unreadCount
}

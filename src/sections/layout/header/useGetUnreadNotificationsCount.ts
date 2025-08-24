import { useState, useEffect, useCallback } from 'react'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { getUnreadNotificationsCount } from '@/notifications/domain/useCases/getUnreadNotificationsCount'
interface UseGetUnreadNotificationsCountResult {
  unreadNotificationsCount: number
  isLoading: boolean
  error: string | null
}

export const useGetUnreadNotificationsCount = (
  repository: NotificationRepository
): UseGetUnreadNotificationsCountResult => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnreadNotificationsCount = useCallback(async () => {
    try {
      setIsLoading(true)
      const count = await getUnreadNotificationsCount(repository)
      setUnreadNotificationsCount(count)
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong fetching unread notifications count. Try again later.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void fetchUnreadNotificationsCount()
  }, [fetchUnreadNotificationsCount])

  return { unreadNotificationsCount, isLoading, error }
}

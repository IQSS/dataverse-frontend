import { useState, useEffect, useCallback } from 'react'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { getAllNotificationsByUser } from '@/notifications/domain/useCases/getAllNotificationsByUser'

interface UseGetNotificationsResult {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

export const useGetNotifications = (
  repository: NotificationRepository
): UseGetNotificationsResult => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const fetchedNotifications = await getAllNotificationsByUser(repository)
      setNotifications(fetchedNotifications)
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong fetching notifications. Try again later.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void fetchNotifications()
  }, [fetchNotifications])

  return { notifications, isLoading, error }
}

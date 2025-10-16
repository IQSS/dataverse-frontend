// hooks/useNotifications.ts
import { useCallback, useContext, useEffect, useState } from 'react'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { getAllNotificationsByUser } from '@/notifications/domain/useCases/getAllNotificationsByUser'
import { SessionContext } from '@/sections/session/SessionContext'

export function useNotifications(repository: NotificationRepository) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useContext(SessionContext)

  const fetchNotifications = useCallback(async () => {
    try {
      const fetched = await getAllNotificationsByUser(repository)
      setError(null)
      setNotifications(fetched)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    if (!user) return

    void fetchNotifications()

    const interval = setInterval(() => {
      void fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications, user])

  const markAsRead = async (ids: number[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, displayAsRead: true } : n))
    )
    try {
      await Promise.all(ids.map((id) => repository.markNotificationAsRead(id)))
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read'
      setError(message)
    }
  }

  const deleteMany = async (ids: number[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)))
    try {
      await Promise.all(ids.map((id) => repository.deleteNotification(id)))
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete notifications'
      setError(message)
    }
  }

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    deleteMany
  }
}

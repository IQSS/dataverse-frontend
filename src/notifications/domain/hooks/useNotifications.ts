import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from '@/sections/session/SessionContext'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { getAllNotificationsByUser } from '@/notifications/domain/useCases/getAllNotificationsByUser'

const POLLING_NOTIFICATIONS_INTERVAL_TIME = 30_000

export function useNotifications(
  repository: NotificationRepository,
  paginationInfo: NotificationsPaginationInfo,
  setPaginationInfo: (pagination: NotificationsPaginationInfo) => void
) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSession()

  const { page, pageSize } = paginationInfo

  const setPaginationInfoRef = useRef(setPaginationInfo)
  useEffect(() => {
    setPaginationInfoRef.current = setPaginationInfo
  }, [setPaginationInfo])

  const fetchNotifications = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true)
      try {
        const currentPagination = new NotificationsPaginationInfo(page, pageSize)
        const fetched = await getAllNotificationsByUser(repository, currentPagination)
        setError(null)

        setPaginationInfoRef.current(
          new NotificationsPaginationInfo(page, pageSize, fetched.totalItemCount)
        )
        setNotifications(fetched.items)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
        setError(message)
      } finally {
        if (!silent) setIsLoading(false)
      }
    },
    [repository, page, pageSize]
  )

  useEffect(() => {
    if (!user) return

    void fetchNotifications(false)

    const interval = setInterval(() => {
      void fetchNotifications(true)
    }, POLLING_NOTIFICATIONS_INTERVAL_TIME)

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

import { isEqual } from 'lodash'
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { getAllNotificationsByUser } from '@/notifications/domain/useCases/getAllNotificationsByUser'
import { SessionContext } from '@/sections/session/SessionContext'

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  markAsRead: (ids: number[]) => Promise<void>
  deleteMany(ids: number[]): Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  // Ensure the user is logged in

  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({
  repository,
  children
}: {
  repository: NotificationRepository
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useContext(SessionContext)

  const fetchNotifications = useCallback(async () => {
    try {
      const fetched = await getAllNotificationsByUser(repository)
      setError(null)

      setNotifications((prev) => (isEqual(prev, fetched) ? prev : fetched))
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
    }, 30000) // 30s polling interval

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

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.displayAsRead),
    [notifications]
  )

  const unreadCount = useMemo(() => unreadNotifications.length, [unreadNotifications])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        refetch: fetchNotifications,
        markAsRead,
        deleteMany
      }}>
      {children}
    </NotificationContext.Provider>
  )
}

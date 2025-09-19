import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
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
  markAsUnread: (ids: number[]) => Promise<void>
  deleteNotifications: (ids: number[]) => Promise<void>
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
      setIsLoading(true)
      const fetched = await getAllNotificationsByUser(repository)
      setNotifications(fetched)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    if (!user) {
      return
    }
    void fetchNotifications()
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
  const markAsUnread = async (_ids: number[]) => {
    // TODO: Implement mark as unread functionality
    return Promise.resolve()
  }

  const deleteNotifications = async (ids: number[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)))
    try {
      await Promise.all(ids.map((id) => repository.deleteNotification(id)))
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete notification'
      setError(message)
    }
  }

  const unreadCount = notifications.filter((n) => !n.displayAsRead).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        refetch: fetchNotifications,
        deleteNotifications,
        markAsRead,
        markAsUnread
      }}>
      {children}
    </NotificationContext.Provider>
  )
}

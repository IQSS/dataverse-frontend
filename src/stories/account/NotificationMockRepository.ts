import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'

export class NotificationMockRepository implements NotificationRepository {
  getAllNotificationsByUser(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 500) // Simulate loading delay
    })
  }

  getUnreadNotificationsCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2) // Simulate 2 unread notifications
      }, 500)
    })
  }

  markNotificationAsRead(notificationId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notification ${notificationId} marked as read.`)
        resolve()
      }, 500)
    })
  }

  deleteNotification(notificationId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notification ${notificationId} deleted.`)
        resolve()
      }, 500)
    })
  }
}

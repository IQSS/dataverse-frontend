import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { getAllNotificationsByUser } from '@iqss/dataverse-client-javascript'
import { JSNotificationMapper } from '../mappers/JSNotificationMapper'

export class NotificationJSDataverseRepository implements NotificationRepository {
  private readonly mapper = new JSNotificationMapper()

  getAllNotificationsByUser(): Promise<Notification[]> {
    return getAllNotificationsByUser
      .execute(true)
      .then((notifications) =>
        notifications.map((notification) => this.mapper.toNotification(notification))
      )
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

import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationMother } from '@tests/component/notifications/domain/models/NotificationMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class NotificationMockRepository implements NotificationRepository {
  getAllNotificationsByUser(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(NotificationMother.createManyRealistic())
      }, FakerHelper.loadingTimout())
    })
  }

  getUnreadNotificationsCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2) // Simulate 2 unread notifications
      }, FakerHelper.loadingTimout())
    })
  }

  markNotificationAsRead(notificationId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notification ${notificationId} marked as read.`)
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  deleteNotification(notificationId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notification ${notificationId} deleted.`)
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
}

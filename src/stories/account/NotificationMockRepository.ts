import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationMother } from '@tests/component/notifications/domain/models/NotificationMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export class NotificationMockRepository implements NotificationRepository {
  private notifications: Notification[] = NotificationMother.createManyRealistic()

  async getAllNotificationsByUser(): Promise<NotificationSubset> {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, FakerHelper.loadingTimout()))
    return { totalItemCount: this.notifications.length, items: this.notifications }
  }

  getUnreadNotificationsCount(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unreadCount = this.notifications.filter((n) => !n.displayAsRead).length
        resolve(unreadCount)
      }, FakerHelper.loadingTimout())
    })
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, FakerHelper.loadingTimout()))
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, displayAsRead: true } : n
    )
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

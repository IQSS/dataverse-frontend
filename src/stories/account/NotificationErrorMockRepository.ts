import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationMother } from '@tests/component/notifications/domain/models/NotificationMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export class NotificationErrorMockRepository implements NotificationRepository {
  private notifications: Notification[] = NotificationMother.createManyRealistic()

  async getAllNotificationsByUser(): Promise<NotificationSubset> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  getUnreadNotificationsCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  deleteNotification(notificationId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }
}

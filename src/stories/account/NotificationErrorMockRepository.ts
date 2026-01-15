import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export class NotificationErrorMockRepository implements NotificationRepository {
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

  async markNotificationAsRead(_notificationId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  deleteNotification(_notificationId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting notifications. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }
}

import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { getAllNotificationsByUser } from '@iqss/dataverse-client-javascript'
import { getUnreadNotificationsCount } from '@iqss/dataverse-client-javascript'
import { markNotificationAsRead } from '@iqss/dataverse-client-javascript'
import { deleteNotification } from '@iqss/dataverse-client-javascript'
import { JSNotificationMapper } from '../mappers/JSNotificationMapper'

export class NotificationJSDataverseRepository implements NotificationRepository {
  private readonly mapper = new JSNotificationMapper()

  getAllNotificationsByUser(): Promise<Notification[]> {
    return getAllNotificationsByUser
      .execute(true)
      .then((notificationSubset) =>
        notificationSubset.notifications.map((notification) =>
          this.mapper.toNotification(notification)
        )
      )
  }

  getUnreadNotificationsCount(): Promise<number> {
    return getUnreadNotificationsCount.execute().then((count) => {
      return count
    })
  }

  markNotificationAsRead(notificationId: number): Promise<void> {
    return markNotificationAsRead.execute(notificationId).then(() => {})
  }

  deleteNotification(notificationId: number): Promise<void> {
    return deleteNotification.execute(notificationId).then(() => {})
  }
}

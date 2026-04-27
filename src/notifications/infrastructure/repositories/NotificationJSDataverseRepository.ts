import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { getAllNotificationsByUser } from '@iqss/dataverse-client-javascript'
import { getUnreadNotificationsCount } from '@iqss/dataverse-client-javascript'
import { markNotificationAsRead } from '@iqss/dataverse-client-javascript'
import { deleteNotification } from '@iqss/dataverse-client-javascript'
import { JSNotificationMapper } from '../mappers/JSNotificationMapper'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export class NotificationJSDataverseRepository implements NotificationRepository {
  private readonly mapper = new JSNotificationMapper()

  getAllNotificationsByUser(
    paginationInfo: NotificationsPaginationInfo
  ): Promise<NotificationSubset> {
    return getAllNotificationsByUser
      .execute(true, false, paginationInfo.pageSize, paginationInfo.offset)
      .then((jsSubset): NotificationSubset => {
        const items = (jsSubset.notifications ?? []).map((notification) =>
          this.mapper.toNotification(notification)
        )
        const totalItemCount = jsSubset.totalNotificationCount ?? items.length
        return { items, totalItemCount }
      })
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

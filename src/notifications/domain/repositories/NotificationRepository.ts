import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export interface NotificationRepository {
  getAllNotificationsByUser(
    paginationInfo: NotificationsPaginationInfo
  ): Promise<NotificationSubset>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadNotificationsCount(): Promise<number>
  markNotificationAsRead(notificationId: number): Promise<void>
}

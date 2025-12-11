import { Notification } from '../models/Notification'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'

export interface NotificationRepository {
  getAllNotificationsByUser(paginationInfo: NotificationsPaginationInfo): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadNotificationsCount(): Promise<number>
  markNotificationAsRead(notificationId: number): Promise<void>
}

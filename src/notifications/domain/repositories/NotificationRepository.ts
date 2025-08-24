import { Notification } from '../models/Notification'

export interface NotificationRepository {
  getAllNotificationsByUser(): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadNotificationsCount(): Promise<number>
  markNotificationAsRead(notificationId: number): Promise<void>
}

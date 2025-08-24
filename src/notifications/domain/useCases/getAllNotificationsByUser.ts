import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'

export function getAllNotificationsByUser(
  notificationRepository: NotificationRepository
): Promise<Notification[]> {
  return notificationRepository.getAllNotificationsByUser()
}

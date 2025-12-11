import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'

export function getAllNotificationsByUser(
  notificationRepository: NotificationRepository,
  paginationInfo: NotificationsPaginationInfo
): Promise<Notification[]> {
  return notificationRepository.getAllNotificationsByUser(paginationInfo)
}

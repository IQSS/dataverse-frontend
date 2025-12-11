import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationsPaginationInfo } from '@/notifications/domain/models/NotificationsPaginationInfo'
import { NotificationSubset } from '@/notifications/domain/models/NotificationSubset'

export function getAllNotificationsByUser(
  notificationRepository: NotificationRepository,
  paginationInfo: NotificationsPaginationInfo
): Promise<NotificationSubset> {
  return notificationRepository.getAllNotificationsByUser(paginationInfo)
}

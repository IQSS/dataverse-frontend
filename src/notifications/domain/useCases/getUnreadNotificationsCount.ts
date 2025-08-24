import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'

export function getUnreadNotificationsCount(
  notificationRepository: NotificationRepository
): Promise<number> {
  return notificationRepository.getUnreadNotificationsCount()
}

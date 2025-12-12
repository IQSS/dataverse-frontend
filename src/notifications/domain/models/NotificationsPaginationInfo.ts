import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class NotificationsPaginationInfo extends PaginationInfo<NotificationsPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'result') {
    super(page, pageSize, totalItems, itemName)
  }
}

import { PaginationInfo } from '@/shared/pagination/domain/models/PaginationInfo'

export class GuestbookResponsesPaginationInfo extends PaginationInfo<GuestbookResponsesPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'Response') {
    super(page, pageSize, totalItems, itemName)
  }
}

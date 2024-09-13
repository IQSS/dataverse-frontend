import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class CollectionItemsPaginationInfo extends PaginationInfo<CollectionItemsPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'results') {
    super(page, pageSize, totalItems, itemName)
  }
}

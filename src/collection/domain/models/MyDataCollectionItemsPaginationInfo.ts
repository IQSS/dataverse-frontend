import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class MyDataCollectionItemsPaginationInfo extends PaginationInfo<MyDataCollectionItemsPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'Item') {
    super(page, pageSize, totalItems, itemName)
  }
}

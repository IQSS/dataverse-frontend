import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class DatasetVersionPaginationInfo extends PaginationInfo<DatasetVersionPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'Version') {
    super(page, pageSize, totalItems, itemName)
  }
}


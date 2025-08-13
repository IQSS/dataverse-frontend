import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class DatasetPaginationInfo extends PaginationInfo<DatasetPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'Dataset') {
    super(page, pageSize, totalItems, itemName)
  }
}

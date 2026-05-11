import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class DatasetVersionPaginationInfo extends PaginationInfo<DatasetVersionPaginationInfo> {
  constructor(
    page = 1,
    pageSize = 10,
    totalItems = 0,
    itemName = 'Version',
    private readonly offsetOverride?: number
  ) {
    super(page, pageSize, totalItems, itemName)
  }

  get offset(): number {
    return this.offsetOverride ?? super.offset
  }
}

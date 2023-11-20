import { PaginationInfo } from '../../../shared/domain/models/PaginationInfo'

export class FilePaginationInfo extends PaginationInfo<FilePaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'File') {
    super(page, pageSize, totalItems, itemName)
  }
}

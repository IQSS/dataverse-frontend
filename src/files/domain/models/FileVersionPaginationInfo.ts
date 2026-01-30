import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'

export class FileVersionPaginationInfo extends PaginationInfo<FileVersionPaginationInfo> {
  constructor(page = 1, pageSize = 10, totalItems = 0, itemName = 'Version') {
    super(page, pageSize, totalItems, itemName)
  }
}

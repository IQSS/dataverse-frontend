import { FilePaginationInfo } from '../../domain/models/FilePaginationInfo'
import { FileCriteria, FileSortByOption } from '../../domain/models/FileCriteria'
import { FileOrderCriteria } from '@iqss/dataverse-client-javascript'

export class DomainFileMapper {
  static toJSPagination(paginationInfo?: FilePaginationInfo): { limit?: number; offset?: number } {
    return {
      limit: paginationInfo?.pageSize,
      offset: paginationInfo?.page
    }
  }

  static toJSFileOrderCriteria(criteria?: FileCriteria): FileOrderCriteria {
    switch (criteria?.sortBy) {
      case FileSortByOption.NAME_AZ:
        return FileOrderCriteria.NAME_AZ
      case FileSortByOption.NAME_ZA:
        return FileOrderCriteria.NAME_ZA
      case FileSortByOption.NEWEST:
        return FileOrderCriteria.NEWEST
      case FileSortByOption.OLDEST:
        return FileOrderCriteria.OLDEST
      case FileSortByOption.SIZE:
        return FileOrderCriteria.SIZE
      case FileSortByOption.TYPE:
        return FileOrderCriteria.TYPE
      default:
        return FileOrderCriteria.NAME_AZ
    }
  }
}

import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../domain/models/FileCriteria'
import {
  FileAccessStatus as JSFileAccessStatus,
  FileSearchCriteria as JSFileSearchCriteria,
  FileOrderCriteria as JSFileOrderCriteria
} from '@iqss/dataverse-client-javascript'
import { FileType } from '../../domain/models/File'
import { FilePaginationInfo } from '../../domain/models/FilePaginationInfo'

export class DomainFileMapper {
  static toJSFileSearchCriteria(criteria: FileCriteria): JSFileSearchCriteria {
    return new JSFileSearchCriteria(
      this.toJSContentType(criteria.filterByType),
      this.toJSAccessStatus(criteria.filterByAccess),
      this.toJSCategoryName(criteria.filterByTag),
      undefined, // This filter is not used in the UI
      this.toJSSearchText(criteria.searchText)
    )
  }

  static toJSFileOrderCriteria(sortBy: FileSortByOption): JSFileOrderCriteria {
    switch (sortBy) {
      case FileSortByOption.NAME_AZ:
        return JSFileOrderCriteria.NAME_AZ
      case FileSortByOption.NAME_ZA:
        return JSFileOrderCriteria.NAME_ZA
      case FileSortByOption.NEWEST:
        return JSFileOrderCriteria.NEWEST
      case FileSortByOption.OLDEST:
        return JSFileOrderCriteria.OLDEST
      case FileSortByOption.SIZE:
        return JSFileOrderCriteria.SIZE
      case FileSortByOption.TYPE:
        return JSFileOrderCriteria.TYPE
    }
  }

  static toJSContentType(type: FileType | undefined): string | undefined {
    return type === undefined ? undefined : type.value
  }

  static toJSAccessStatus(
    accessStatus: FileAccessOption | undefined
  ): JSFileAccessStatus | undefined {
    switch (accessStatus) {
      case FileAccessOption.PUBLIC:
        return JSFileAccessStatus.PUBLIC
      case FileAccessOption.RESTRICTED:
        return JSFileAccessStatus.RESTRICTED
      case FileAccessOption.EMBARGOED:
        return JSFileAccessStatus.EMBARGOED
      case FileAccessOption.EMBARGOED_RESTRICTED:
        return JSFileAccessStatus.EMBARGOED_RESTRICTED
    }
  }

  static toJSCategoryName(filterByTag: FileTag | undefined): string | undefined {
    return filterByTag === undefined ? undefined : filterByTag.value
  }

  static toJSSearchText(searchText: string | undefined): string | undefined {
    return searchText
  }
}

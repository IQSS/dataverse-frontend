import { FileType } from './File'

export class FileCriteria {
  constructor(
    public readonly sortBy: FileSortByOption = FileSortByOption.NAME_AZ,
    public readonly filterByType?: FileType,

    public readonly filterByAccess?: FileAccessOption
  ) {}

  withSortBy(sortBy: FileSortByOption): FileCriteria {
    return new FileCriteria(sortBy, this.filterByType)
  }

  withFilterByType(filterByType: string | undefined): FileCriteria {
    if (filterByType === undefined) {
      return new FileCriteria(this.sortBy, undefined)
    }

    return new FileCriteria(this.sortBy, new FileType(filterByType))
  }

  withFilterByAccess(filterByAccess: FileAccessOption | undefined): FileCriteria {
    if (filterByAccess === undefined) {
      return new FileCriteria(this.sortBy, this.filterByType, undefined)
    }

    return new FileCriteria(this.sortBy, this.filterByType, filterByAccess)
  }
}

export enum FileSortByOption {
  NAME_AZ = 'name_az',
  NAME_ZA = 'name_za',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  SIZE = 'size',
  TYPE = 'type'
}

export enum FileAccessOption {
  PUBLIC = 'public',
  RESTRICTED = 'restricted',
  EMBARGOED = 'embargoed_public',
  EMBARGOED_RESTRICTED = 'embargoed_restricted'
}

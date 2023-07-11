export class FileCriteria {
  constructor(
    public readonly sortBy: FileSortByOption = FileSortByOption.NAME_AZ,
    public readonly filterByType: string = 'All'
  ) {}

  withSortBy(sortBy: FileSortByOption): FileCriteria {
    return new FileCriteria(sortBy, this.filterByType)
  }

  withFilterByType(filterByType: string): FileCriteria {
    return new FileCriteria(this.sortBy, filterByType)
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

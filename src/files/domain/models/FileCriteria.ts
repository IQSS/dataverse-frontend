export interface FileCriteria {
  sortBy?: FileSortByOption
}

export enum FileSortByOption {
  NAME_AZ = 'name_az',
  NAME_ZA = 'name_za',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  SIZE = 'size',
  TYPE = 'type'
}

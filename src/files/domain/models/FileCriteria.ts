export interface FileCriteria {
  orderBy?: FileOrderBy
}

export enum FileOrderBy {
  NAME_AZ = 'name_az',
  NAME_ZA = 'name_za',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  SIZE = 'size',
  TYPE = 'type'
}

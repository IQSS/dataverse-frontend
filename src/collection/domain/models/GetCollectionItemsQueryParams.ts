export enum GetCollectionItemsQueryParams {
  SORT = 'sort',
  ORDER = 'order',
  START = 'start',
  TYPES = 'types',
  FILTER_QUERIES = 'fq'
}

export enum SortType {
  NAME = 'name',
  DATE = 'date'
}

export enum OrderType {
  ASC = 'asc',
  DESC = 'desc'
}

export type FilterQuery = `${string}:${string}`

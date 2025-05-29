import { type CollectionItemType } from './CollectionItemType'

export enum SortType {
  NAME = 'name',
  DATE = 'date',
  SCORE = 'score'
}

export enum OrderType {
  ASC = 'asc',
  DESC = 'desc'
}

export type FilterQuery = `${string}:${string}`

export class CollectionSearchCriteria {
  constructor(
    public readonly searchText?: string,
    public readonly itemTypes?: CollectionItemType[],
    public readonly sort?: SortType,
    public readonly order?: OrderType,
    public readonly filterQueries?: FilterQuery[]
  ) {}

  withSearchText(searchText: string | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(
      searchText,
      this.itemTypes,
      this.sort,
      this.order,
      this.filterQueries
    )
  }

  withItemTypes(itemTypes: CollectionItemType[] | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(
      this.searchText,
      itemTypes,
      this.sort,
      this.order,
      this.filterQueries
    )
  }

  withSort(sort: SortType | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(
      this.searchText,
      this.itemTypes,
      sort,
      this.order,
      this.filterQueries
    )
  }

  withOrder(order: OrderType | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(
      this.searchText,
      this.itemTypes,
      this.sort,
      order,
      this.filterQueries
    )
  }

  withFilterQueries(filterQueries: FilterQuery[] | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(
      this.searchText,
      this.itemTypes,
      this.sort,
      this.order,
      filterQueries
    )
  }

  hasSearchText(): boolean {
    return !!this.searchText
  }
}

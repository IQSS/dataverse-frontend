import { type CollectionItemType } from './CollectionItemType'
import { FilterQuery, OrderType, SortType } from './GetCollectionItemsQueryParams'

export class CollectionSearchCriteria {
  constructor(
    public readonly searchText?: string,
    public readonly itemTypes?: CollectionItemType[],
    public readonly sort?: SortType,
    public readonly order?: OrderType,
    public readonly filterQueries?: FilterQuery[]
  ) {}

  withSearchText(searchText: string | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(searchText, this.itemTypes, this.sort, this.order)
  }

  withItemTypes(itemTypes: CollectionItemType[] | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(this.searchText, itemTypes, this.sort, this.order)
  }

  withSort(sort: SortType | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(this.searchText, this.itemTypes, sort, this.order)
  }

  withOrder(order: OrderType | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(this.searchText, this.itemTypes, this.sort, order)
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

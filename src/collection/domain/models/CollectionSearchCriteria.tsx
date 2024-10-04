import { type CollectionItemType } from './CollectionItemType'

export class CollectionSearchCriteria {
  constructor(
    public readonly searchText?: string,
    public readonly itemTypes?: CollectionItemType[]
  ) {}

  withSearchText(searchText: string | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(searchText, this.itemTypes)
  }

  withItemTypes(itemTypes: CollectionItemType[] | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(this.searchText, itemTypes)
  }

  hasSearchText(): boolean {
    return !!this.searchText
  }
}

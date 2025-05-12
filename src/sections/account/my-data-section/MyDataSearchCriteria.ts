import type { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import type { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'

export class MyDataSearchCriteria {
  constructor(
    public readonly itemTypes: CollectionItemType[],
    public readonly roleIds: number[],
    public readonly publicationQueries?: FilterQuery[],
    public readonly searchText?: string
  ) {}

  withSearchText(searchText: string | undefined): MyDataSearchCriteria {
    return new MyDataSearchCriteria(
      this.itemTypes,
      this.roleIds,
      this.publicationQueries,
      searchText
    )
  }
  hasSearchText(): boolean {
    return !!this.searchText
  }
}

import type { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

export class MyDataSearchCriteria {
  constructor(
    public readonly itemTypes: CollectionItemType[],
    public readonly roleIds: number[],
    public readonly publicationStatuses: PublicationStatus[],
    public readonly searchText?: string,
    public readonly otherUserName?: string
  ) {}

  withSearchText(searchText: string | undefined): MyDataSearchCriteria {
    return new MyDataSearchCriteria(
      this.itemTypes,
      this.roleIds,
      this.publicationStatuses,
      searchText,
      this.otherUserName
    )
  }
  hasSearchText(): boolean {
    return !!this.searchText
  }
}

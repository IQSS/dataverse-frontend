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

  hasSearchText(): boolean {
    return !!this.searchText
  }
}

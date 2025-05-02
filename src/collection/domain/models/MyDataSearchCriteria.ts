import { type CollectionItemType } from './CollectionItemType'

export enum MyDataPublishingStatus {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  DRAFT = 'draft',
  DEACCESSIONED = 'deaccessioned',
  EMBARGOED = 'embargoed'
}

export type FilterQuery = `${string}:${string}`

export class MyDataSearchCriteria {
  constructor(
    public readonly itemTypes: CollectionItemType[],
    public readonly publishingStatuses: MyDataPublishingStatus[] = [],
    public readonly roleIds: number[],
    public readonly searchText?: string
  ) {}

  hasSearchText(): boolean {
    return !!this.searchText
  }
}

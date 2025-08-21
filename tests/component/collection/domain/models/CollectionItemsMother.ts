import {
  CollectionItem,
  CollectionItemsFacet
} from '@/collection/domain/models/CollectionItemSubset'
import { FileItemTypePreviewMother } from '../../../files/domain/models/FileItemTypePreviewMother'
import { CollectionItemTypePreviewMother } from './CollectionItemTypePreviewMother'
import { DatasetItemTypePreviewMother } from '../../../dataset/domain/models/DatasetItemTypePreviewMother'
import { PublicationStatusCount } from '@/collection/domain/models/MyDataCollectionItemSubset'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

interface CreateItemsProps {
  numberOfCollections?: number
  numberOfDatasets?: number
  numberOfFiles?: number
  includeUserRoles?: boolean
}

export class CollectionItemsMother {
  static createItems({
    numberOfCollections = 1,
    numberOfDatasets = 1,
    numberOfFiles = 1,
    includeUserRoles = false
  }: CreateItemsProps): CollectionItem[] {
    const collections = CollectionItemTypePreviewMother.createMany(
      numberOfCollections,
      includeUserRoles
    )
    const datasets = DatasetItemTypePreviewMother.createMany(numberOfDatasets, includeUserRoles)
    const files = FileItemTypePreviewMother.createMany(numberOfFiles, includeUserRoles)

    return [...collections, ...datasets, ...files]
  }
  static createMyDataPublicationCounts(): PublicationStatusCount[] {
    return [
      { publicationStatus: PublicationStatus.Published, count: 1 },
      { publicationStatus: PublicationStatus.Unpublished, count: 1 },
      { publicationStatus: PublicationStatus.Draft, count: 0 },
      { publicationStatus: PublicationStatus.InReview, count: 1 },
      { publicationStatus: PublicationStatus.Deaccessioned, count: 1 }
    ]
  }
  static createItemsFacets(): CollectionItemsFacet[] {
    return [
      {
        name: 'dvCategory',
        friendlyName: 'Dataverse Category',
        labels: [
          {
            name: 'Department',
            count: 1
          },
          {
            name: 'Journal',
            count: 1
          },
          {
            name: 'Laboratory',
            count: 1
          },
          {
            name: 'Researcher',
            count: 1
          },
          {
            name: 'Organization or Institution',
            count: 1
          },
          {
            name: 'Foo',
            count: 1
          },
          {
            name: 'Bar',
            count: 1
          }
        ]
      },
      {
        name: 'authorName_ss',
        friendlyName: 'Author Name',
        labels: [
          {
            name: 'Admin, Dataverse',
            count: 4
          }
        ]
      },
      {
        name: 'publicationDate',
        friendlyName: 'Publication Year',
        labels: [
          {
            name: '2025',
            count: 27
          },
          {
            name: '2023',
            count: 28
          },
          {
            name: '2024',
            count: 25
          },
          {
            name: '2022',
            count: 34
          }
        ]
      },
      {
        name: 'dateOfDeposit',
        friendlyName: 'Date of Deposit',
        labels: [
          {
            name: '2025',
            count: 1
          },
          {
            name: '2024',
            count: 4
          },
          {
            name: '2023',
            count: 2
          },
          {
            name: '2022',
            count: 7
          }
        ]
      },
      {
        name: 'fileTag',
        friendlyName: 'File Tag',
        labels: [
          {
            name: 'Dragon: Ball',
            count: 1
          },
          {
            name: 'John:Doe',
            count: 1
          }
        ]
      }
    ]
  }
}

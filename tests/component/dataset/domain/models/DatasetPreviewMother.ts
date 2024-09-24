import { faker } from '@faker-js/faker'
import { DatasetPreview } from '../../../../../src/dataset/domain/models/DatasetPreview'
import { DatasetVersionMother } from './DatasetMother'
import { FakerHelper } from '../../../shared/FakerHelper'
import { CollectionItemType } from '../../../../../src/collection/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../../../src/shared/core/domain/models/PublicationStatus'

export class DatasetPreviewMother {
  static createMany(count: number): DatasetPreview[] {
    return Array.from({ length: count }, () => this.create())
  }

  static createManyRealistic(count: number): DatasetPreview[] {
    return Array.from({ length: count }, () => this.createRealistic())
  }

  static create(props?: Partial<DatasetPreview>): DatasetPreview {
    const datasetPreview = {
      persistentId: faker.datatype.uuid(),
      version: DatasetVersionMother.create(),
      releaseOrCreateDate: FakerHelper.pastDate(),
      description: faker.lorem.paragraph(),
      thumbnail: faker.datatype.boolean() ? FakerHelper.getImageUrl() : undefined,
      publicationStatuses: [PublicationStatus.Published],
      parentCollectionName: faker.lorem.word(),
      parentCollectionAlias: faker.lorem.slug(),
      ...props
    }
    return {
      type: CollectionItemType.DATASET,
      persistentId: datasetPreview.persistentId,
      version: datasetPreview.version,
      releaseOrCreateDate: datasetPreview.releaseOrCreateDate,
      description: datasetPreview.description,
      publicationStatuses: datasetPreview.publicationStatuses,
      parentCollectionName: datasetPreview.parentCollectionName,
      parentCollectionAlias: datasetPreview.parentCollectionAlias,
      thumbnail: datasetPreview.thumbnail
    }
  }

  static createRealistic(): DatasetPreview {
    return faker.datatype.boolean() ? this.createDraft() : this.createDeaccessioned()
  }

  static createDraft(): DatasetPreview {
    return this.create({
      version: DatasetVersionMother.createDraft(),
      publicationStatuses: [PublicationStatus.Draft]
    })
  }

  static createWithThumbnail(): DatasetPreview {
    return this.create({ thumbnail: FakerHelper.getImageUrl() })
  }

  static createWithNoThumbnail(): DatasetPreview {
    return this.create({ thumbnail: undefined })
  }

  static createDeaccessioned(): DatasetPreview {
    return this.create({
      version: DatasetVersionMother.createDeaccessioned()
    })
  }
}

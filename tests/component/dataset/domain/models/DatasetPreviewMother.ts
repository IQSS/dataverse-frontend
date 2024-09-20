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
      ...props
    }

    return new DatasetPreview(
      CollectionItemType.DATASET,
      datasetPreview.persistentId,
      datasetPreview.version,
      datasetPreview.releaseOrCreateDate,
      datasetPreview.description,
      [PublicationStatus.Published],
      faker.lorem.word(),
      faker.lorem.word(),
      datasetPreview.thumbnail
    )
  }

  static createRealistic(): DatasetPreview {
    return faker.datatype.boolean() ? this.createDraft() : this.createDeaccessioned()
  }

  static createDraft(): DatasetPreview {
    return this.create({
      version: DatasetVersionMother.createDraft()
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

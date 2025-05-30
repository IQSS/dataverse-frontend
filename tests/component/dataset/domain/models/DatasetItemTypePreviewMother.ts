import { faker } from '@faker-js/faker'
import { DatasetItemTypePreview } from '../../../../../src/dataset/domain/models/DatasetItemTypePreview'
import { DatasetVersionMother } from './DatasetMother'
import { FakerHelper } from '../../../shared/FakerHelper'
import { CollectionItemType } from '../../../../../src/collection/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../../../src/shared/core/domain/models/PublicationStatus'

export class DatasetItemTypePreviewMother {
  static createMany(
    count: number,
    includeUserRoles = false,
    props?: Partial<DatasetItemTypePreview>
  ): DatasetItemTypePreview[] {
    return Array.from({ length: count }, () =>
      this.create({
        ...props,
        userRoles: includeUserRoles
          ? faker.helpers.arrayElements(['Admin', 'Curator', 'Contributor', 'Editor'])
          : props?.userRoles
      })
    )
  }
  static createManyRealistic(count: number): DatasetItemTypePreview[] {
    return Array.from({ length: count }, () => this.createRealistic())
  }

  static create(props?: Partial<DatasetItemTypePreview>): DatasetItemTypePreview {
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
      thumbnail: datasetPreview.thumbnail,
      userRoles: datasetPreview.userRoles
    }
  }

  static createRealistic(): DatasetItemTypePreview {
    return faker.datatype.boolean() ? this.createDraft() : this.createDeaccessioned()
  }

  static createDraft(): DatasetItemTypePreview {
    return this.create({
      version: DatasetVersionMother.createDraft(),
      publicationStatuses: [PublicationStatus.Draft],
      thumbnail: undefined
    })
  }

  static createWithThumbnail(): DatasetItemTypePreview {
    return this.create({ thumbnail: FakerHelper.getImageUrl() })
  }

  static createWithNoThumbnail(): DatasetItemTypePreview {
    return this.create({ thumbnail: undefined })
  }

  static createDeaccessioned(): DatasetItemTypePreview {
    return this.create({
      version: DatasetVersionMother.createDeaccessioned()
    })
  }
}

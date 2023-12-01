import { faker } from '@faker-js/faker'
import { DatasetPreview } from '../../../../../src/dataset/domain/models/DatasetPreview'
import { DatasetLabelsMother, DatasetVersionMother } from './DatasetMother'

export class DatasetPreviewMother {
  static createMany(count: number): DatasetPreview[] {
    return Array.from({ length: count }, () => this.create())
  }

  static create(props?: Partial<DatasetPreview>): DatasetPreview {
    return {
      persistentId: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      labels: DatasetLabelsMother.create(),
      isDeaccessioned: false,
      thumbnail: faker.datatype.boolean() ? faker.image.imageUrl() : undefined,
      releaseOrCreateDate: faker.date.past(),
      version: DatasetVersionMother.create(),
      citation:
        'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, DRAFT VERSION',
      ...props
    }
  }

  static createWithThumbnail(): DatasetPreview {
    return this.create({ thumbnail: faker.image.imageUrl(), isDeaccessioned: false })
  }

  static createDeaccessioned(): DatasetPreview {
    return this.create({ isDeaccessioned: true })
  }
}

import { faker } from '@faker-js/faker'
import { DatasetPreview } from '../../../../../src/dataset/domain/models/DatasetPreview'
import { DatasetCitationMother, DatasetLabelsMother, DatasetVersionMother } from './DatasetMother'

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
      title: faker.lorem.sentence(),
      labels: DatasetLabelsMother.create(),
      isDeaccessioned: faker.datatype.boolean(),
      thumbnail: faker.datatype.boolean() ? faker.image.imageUrl() : undefined,
      releaseOrCreateDate: faker.date.past(),
      version: DatasetVersionMother.create(),
      citation: DatasetCitationMother.create(),
      description: faker.lorem.paragraph(),
      ...props
    }

    return new DatasetPreview(
      datasetPreview.persistentId,
      datasetPreview.title,
      datasetPreview.version,
      datasetPreview.citation,
      datasetPreview.labels,
      datasetPreview.isDeaccessioned,
      datasetPreview.releaseOrCreateDate,
      datasetPreview.description,
      datasetPreview.thumbnail
    )
  }

  static createRealistic(): DatasetPreview {
    return faker.datatype.boolean() ? this.createDraft() : this.createDeaccessioned()
  }

  static createDraft(): DatasetPreview {
    return this.create({
      isDeaccessioned: false,
      labels: DatasetLabelsMother.createDraft(),
      citation: DatasetCitationMother.createDraft()
    })
  }

  static createWithThumbnail(): DatasetPreview {
    return this.create({ thumbnail: faker.image.imageUrl(), isDeaccessioned: false })
  }

  static createWithNoThumbnail(): DatasetPreview {
    return this.create({ thumbnail: undefined, isDeaccessioned: false })
  }

  static createDeaccessioned(): DatasetPreview {
    return this.create({
      isDeaccessioned: true,
      labels: DatasetLabelsMother.createDeaccessioned(),
      citation: DatasetCitationMother.createDeaccessioned()
    })
  }
}

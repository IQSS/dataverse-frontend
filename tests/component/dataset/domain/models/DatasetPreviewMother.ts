import { faker } from '@faker-js/faker'
import { DatasetPreview } from '../../../../../src/dataset/domain/models/DatasetPreview'

export class DatasetPreviewMother {
  static createMany(count: number): DatasetPreview[] {
    return Array.from({ length: count }, () => this.create())
  }

  static create(props?: Partial<DatasetPreview>): DatasetPreview {
    return {
      persistentId: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      ...props
    }
  }
}

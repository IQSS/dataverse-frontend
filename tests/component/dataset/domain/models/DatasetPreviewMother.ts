import { faker } from '@faker-js/faker'
import { DatasetPreview } from '../../../../../src/dataset/domain/models/DatasetPreview'
import { DatasetLabelsMother } from './DatasetMother'

export class DatasetPreviewMother {
  static createMany(count: number): DatasetPreview[] {
    return Array.from({ length: count }, () => this.create())
  }

  static create(props?: Partial<DatasetPreview>): DatasetPreview {
    return {
      persistentId: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      labels: DatasetLabelsMother.create(),
      ...props
    }
  }
}

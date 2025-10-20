import { faker } from '@faker-js/faker'
import { DatasetType } from '@/dataset/domain/models/DatasetType'

export class DatasetTypeMother {
  static createMany(count: number, props?: Partial<DatasetType>): DatasetType[] {
    return Array.from({ length: count }, () => this.create(props))
  }
  static create(props?: Partial<DatasetType>): DatasetType {
    return {
      id: faker.datatype.number({ min: 1 }),
      name: faker.lorem.words(3),
      ...props
    }
  }

  static creatDefaultDatasetType(): DatasetType {
    return this.create({ id: 1, name: 'dataset', linkedMetadataBlocks: [], availableLicenses: [] })
  }
}

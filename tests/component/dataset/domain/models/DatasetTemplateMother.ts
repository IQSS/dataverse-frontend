import { faker } from '@faker-js/faker'
import { DatasetTemplate } from '@/dataset/domain/models/DatasetTemplate'

export class DatasetTemplateMother {
  static createMany(count: number, props?: Partial<DatasetTemplate>): DatasetTemplate[] {
    return Array.from({ length: count }, () => this.create(props))
  }
  static create(props?: Partial<DatasetTemplate>): DatasetTemplate {
    return {
      id: faker.datatype.number({ min: 1 }),
      name: faker.lorem.words(3),
      collectionAlias: faker.lorem.word({ length: { min: 3, max: 15 } }),
      createTime: 'Tue Sep 02 13:13:47 UTC 2025',
      createDate: 'Sep 2, 2025',
      datasetFields: {},
      isDefault: faker.datatype.boolean(),
      usageCount: faker.datatype.number({ min: 0, max: 100 }),
      instructions: [],
      termsOfUse: {
        termsOfAccess: { fileAccessRequest: false }
      },
      ...props
    }
  }
}

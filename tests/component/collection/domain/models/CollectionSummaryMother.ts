import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { faker } from '@faker-js/faker'

export class CollectionSummaryMother {
  static create(props?: Partial<CollectionSummary>): CollectionSummary {
    return {
      id: faker.datatype.number(),
      alias: faker.lorem.word(),
      displayName: faker.lorem.words(3),
      ...props
    }
  }

  static createMany(count: number): CollectionSummary[] {
    return Array.from({ length: count }, () => this.create())
  }
}

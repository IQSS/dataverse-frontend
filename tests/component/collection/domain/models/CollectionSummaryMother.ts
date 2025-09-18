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

  static createRealistic(): CollectionSummary {
    return this.create({
      id: 1,
      alias: 'my-collection',
      displayName: 'My Collection'
    })
  }

  static createManyRealistic(count: number): CollectionSummary[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        id: index + 1,
        alias: `collection-${index + 1}`,
        displayName: `Collection ${index + 1}`
      })
    )
  }
}

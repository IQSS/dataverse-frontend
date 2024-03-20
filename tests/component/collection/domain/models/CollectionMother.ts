import { Collection } from '../../../../../src/collection/domain/models/Collection'
import { faker } from '@faker-js/faker'

export class CollectionMother {
  static create(props?: Partial<Collection>): Collection {
    return {
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      description: faker.random.words(),
      affiliation: faker.random.word(),
      ...props
    }
  }

  static createRealistic(): Collection {
    return CollectionMother.create({
      id: 'science',
      name: 'Collection Name',
      description: 'We do all the science.',
      affiliation: 'Scientific Research University'
    })
  }
}

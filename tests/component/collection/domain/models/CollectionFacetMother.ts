import { CollectionFacet } from '../../../../../src/collection/domain/models/CollectionFacet'
import { faker } from '@faker-js/faker'

export class CollectionFacetMother {
  static createFacets(): CollectionFacet[] {
    return [
      {
        id: faker.datatype.number(),
        name: faker.lorem.word(),
        displayName: faker.lorem.words()
      },
      {
        id: faker.datatype.number(),
        name: faker.lorem.word(),
        displayName: faker.lorem.words()
      }
    ]
  }
}

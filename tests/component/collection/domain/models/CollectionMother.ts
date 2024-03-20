import { Collection } from '../../../../../src/collection/domain/models/Collection'
import { faker } from '@faker-js/faker'
import { FakerHelper } from '../../../shared/FakerHelper'

export class CollectionMother {
  static create(props?: Partial<Collection>): Collection {
    return {
      id: faker.datatype.uuid(),
      name: faker.lorem.words(3),
      description: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
      affiliation: faker.datatype.boolean() ? faker.lorem.words(3) : undefined,
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

  static createWithOnlyRequiredFields(props?: Partial<Collection>): Collection {
    return CollectionMother.create({
      id: faker.datatype.uuid(),
      name: FakerHelper.collectionName(),
      affiliation: undefined,
      description: undefined,
      ...props
    })
  }

  static createComplete(): Collection {
    return CollectionMother.create({
      id: faker.datatype.uuid(),
      name: FakerHelper.collectionName(),
      description: FakerHelper.paragraph(),
      affiliation: FakerHelper.affiliation()
    })
  }

  static createWithDescription(): Collection {
    return CollectionMother.createWithOnlyRequiredFields({
      description: FakerHelper.paragraph()
    })
  }

  static createWithAffiliation(): Collection {
    return CollectionMother.createWithOnlyRequiredFields({
      affiliation: FakerHelper.affiliation()
    })
  }
}

import { faker } from '@faker-js/faker'
import { FakerHelper } from '../../../shared/FakerHelper'
import { CollectionPreview } from '../../../../../src/collection/domain/models/CollectionPreview'

export class CollectionPreviewMother {
  static create(props?: Partial<CollectionPreview>): CollectionPreview {
    return {
      id: faker.datatype.uuid(),
      name: faker.lorem.words(3),
      isReleased: faker.datatype.boolean(),
      releaseOrCreateDate: faker.date.recent(),
      parentCollectionId: faker.datatype.boolean() ? faker.datatype.uuid() : undefined,
      parentCollectionName: faker.datatype.boolean() ? faker.lorem.words(3) : undefined,
      description: faker.datatype.boolean()
        ? `${faker.lorem.paragraph()} **${faker.lorem.sentence()}** ${faker.lorem.paragraph()}`
        : undefined,
      affiliation: faker.datatype.boolean() ? faker.lorem.words(3) : undefined,
      ...props
    }
  }

  static createRealistic(): CollectionPreview {
    return CollectionPreviewMother.create({
      id: 'science',
      isReleased: true,
      name: 'Scientific Research Collection',
      releaseOrCreateDate: new Date('2021-01-01'),
      parentCollectionId: 'parentId',
      parentCollectionName: 'University Parent Collection',
      description: 'We do all the science.',
      affiliation: 'Scientific Research University'
    })
  }

  static createWithOnlyRequiredFields(props?: Partial<CollectionPreview>): CollectionPreview {
    return CollectionPreviewMother.create({
      id: faker.datatype.uuid(),
      name: FakerHelper.collectionName(),
      isReleased: faker.datatype.boolean(),
      affiliation: undefined,
      description: undefined,
      ...props
    })
  }

  static createComplete(): CollectionPreview {
    return CollectionPreviewMother.create({
      id: faker.datatype.uuid(),
      isReleased: faker.datatype.boolean(),
      name: FakerHelper.collectionName(),
      parentCollectionId: faker.datatype.uuid(),
      parentCollectionName: faker.lorem.words(3),
      releaseOrCreateDate: FakerHelper.pastDate(),
      description: FakerHelper.paragraph(),
      affiliation: FakerHelper.affiliation()
    })
  }
  static createUnpublished(): CollectionPreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      isReleased: false,
      affiliation: FakerHelper.affiliation()
    })
  }
  static createWithDescription(): CollectionPreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      description: FakerHelper.paragraph()
    })
  }

  static createWithAffiliation(): CollectionPreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      affiliation: FakerHelper.affiliation()
    })
  }
}

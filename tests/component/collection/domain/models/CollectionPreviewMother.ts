import { faker } from '@faker-js/faker'
import { FakerHelper } from '../../../shared/FakerHelper'
import { CollectionItemTypePreview } from '../../../../../src/collection/domain/models/CollectionItemTypePreview'
import { CollectionItemType } from '../../../../../src/collection/domain/models/CollectionItemType'

export class CollectionPreviewMother {
  static create(props?: Partial<CollectionItemTypePreview>): CollectionItemTypePreview {
    return {
      type: CollectionItemType.COLLECTION,
      alias: faker.datatype.string(10),
      name: faker.lorem.words(3),
      isReleased: faker.datatype.boolean(),
      releaseOrCreateDate: faker.date.recent(),
      parentCollectionAlias: faker.datatype.string(10),
      parentCollectionName: faker.lorem.words(3),
      description: faker.datatype.boolean()
        ? `${faker.lorem.paragraph()} **${faker.lorem.sentence()}** ${faker.lorem.paragraph()}`
        : undefined,
      affiliation: faker.datatype.boolean() ? faker.lorem.words(3) : undefined,
      ...props
    }
  }

  static createRealistic(): CollectionItemTypePreview {
    return CollectionPreviewMother.create({
      isReleased: true,
      name: 'Scientific Research Collection',
      alias: 'scientific-research-collection',
      releaseOrCreateDate: new Date('2021-01-01'),
      parentCollectionAlias: 'parent-alias',
      parentCollectionName: 'University Parent Collection',
      description: 'We do all the science.',
      affiliation: 'Scientific Research University'
    })
  }

  static createWithOnlyRequiredFields(
    props?: Partial<CollectionItemTypePreview>
  ): CollectionItemTypePreview {
    return CollectionPreviewMother.create({
      name: FakerHelper.collectionName(),
      isReleased: faker.datatype.boolean(),
      affiliation: undefined,
      description: undefined,
      ...props
    })
  }

  static createComplete(): CollectionItemTypePreview {
    return CollectionPreviewMother.create({
      isReleased: faker.datatype.boolean(),
      name: FakerHelper.collectionName(),
      parentCollectionAlias: faker.datatype.string(10),
      parentCollectionName: faker.lorem.words(3),
      releaseOrCreateDate: FakerHelper.pastDate(),
      description: FakerHelper.paragraph(),
      affiliation: FakerHelper.affiliation()
    })
  }
  static createUnpublished(): CollectionItemTypePreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      isReleased: false,
      affiliation: FakerHelper.affiliation()
    })
  }
  static createWithDescription(): CollectionItemTypePreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      description: FakerHelper.paragraph()
    })
  }

  static createWithAffiliation(): CollectionItemTypePreview {
    return CollectionPreviewMother.createWithOnlyRequiredFields({
      affiliation: FakerHelper.affiliation()
    })
  }
}

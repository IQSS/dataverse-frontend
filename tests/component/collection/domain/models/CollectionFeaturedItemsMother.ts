import { faker } from '@faker-js/faker'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionFeaturedItemsMother {
  static create(props?: Partial<CollectionFeaturedItem>): CollectionFeaturedItem {
    return {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      ...props
    }
  }

  static createWithImage(props?: Partial<CollectionFeaturedItem['image']>): CollectionFeaturedItem {
    return CollectionFeaturedItemsMother.create({
      image: {
        url: faker.image.imageUrl(),
        altText: faker.lorem.words(2),
        ...props
      }
    })
  }

  // TODO:ME Create realistic for demo?
}

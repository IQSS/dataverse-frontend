import { faker } from '@faker-js/faker'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionFeaturedItemsMother {
  static create(props?: Partial<CollectionFeaturedItem>): CollectionFeaturedItem {
    return {
      title: this.capitalizeWord(faker.lorem.words(2)),
      content: faker.lorem.paragraph(),
      ...props
    }
  }

  static createWithImage(
    props?: Partial<CollectionFeaturedItem['image']>,
    imageCategory?: string
  ): CollectionFeaturedItem {
    return CollectionFeaturedItemsMother.create({
      image: {
        url: faker.image.imageUrl(undefined, undefined, imageCategory),
        altText: faker.lorem.words(2),
        ...props
      }
    })
  }

  private static capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
}

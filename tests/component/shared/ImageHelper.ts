import { faker } from '@faker-js/faker'

export function getImageUrl(width?: number, height?: number) {
  // Always use a static image for chromatic builds
  if (import.meta.env.STORYBOOK_CHROMATIC_BUILD === 'true') {
    return 'https://picsum.photos/id/237/200'
  } else {
    faker.image.imageUrl(width, height)
  }
}

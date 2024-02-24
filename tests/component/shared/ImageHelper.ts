import { faker } from '@faker-js/faker'

export function getImageUrl() {
  // Always use a static image for chromatic builds
  if (import.meta.env.STORYBOOK_CHROMATIC_BUILD === 'true') {
    return 'https://loremflickr.com/320/240?lock=1'
  } else {
    faker.image.imageUrl()
  }
}

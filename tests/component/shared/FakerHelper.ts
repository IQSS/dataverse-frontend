import { faker } from '@faker-js/faker'
import {
  FileLabel,
  FileLabelType,
  FileSize,
  FileSizeUnit,
  FileDateType
} from '../../../src/files/domain/models/FileMetadata'

// Helps to generate reproducible fake data

export class FakerHelper {
  static setFakerSeed() {
    if (this.chromaticBuild()) {
      faker.seed(123) // Use a specific seed during Chromatic runs
    }
  }
  static chromaticBuild() {
    return import.meta.env.STORYBOOK_CHROMATIC_BUILD === 'true'
  }
  /*
  The loadingTimout method is used to simulate a delay in the response of a promise.
  We set it to zero when running in Chromatic, so that calls to Faker happen in a
  predictable way, and the Faker data is reproducible.
   */
  static loadingTimout() {
    if (this.chromaticBuild()) {
      return 0
    } else {
      return 1000
    }
  }
  static smallNumber(max: number) {
    if (this.chromaticBuild()) {
      return 12
    } else {
      return faker.datatype.number(max)
    }
  }
  static fileLabel(props?: Partial<FileLabel>) {
    if (this.chromaticBuild()) {
      return {
        type: FileLabelType.TAG,
        value: faker.lorem.word(),
        ...props
      }
    } else {
      return {
        type: faker.helpers.arrayElement(Object.values(FileLabelType)),
        value: faker.lorem.word(),
        ...props
      }
    }
  }
  static fileDateType() {
    if (this.chromaticBuild()) {
      return FileDateType.PUBLISHED
    } else {
      return faker.helpers.arrayElement(Object.values(FileDateType))
    }
  }
  static fileSize(props?: Partial<FileSize>) {
    if (this.chromaticBuild()) {
      const size = {
        value: 450,
        unit: FileSizeUnit.MEGABYTES,
        ...props
      }
      return new FileSize(size.value, size.unit)
    } else {
      const size = {
        value: faker.datatype.number({ max: 1024, precision: 2 }),
        unit: faker.helpers.arrayElement(Object.values(FileSizeUnit)),
        ...props
      }
      return new FileSize(size.value, size.unit)
    }
  }
  static directoryPath() {
    if (this.chromaticBuild()) {
      return '/usr/X11R6'
    } else {
      return faker.system.directoryPath()
    }
  }
  static paragraph(sentenceCount?: number) {
    if (this.chromaticBuild()) {
      return 'Voluptas amet consectetur dolore doloribus. Cumque et quo eum voluptatem eum dolores dignissimos. Vel inventore quaerat officiis. Nobis debitis quidem hic laudantium blanditiis. Error excepturi dicta aliquam enim ducimus.'
    } else {
      return faker.lorem.paragraph(sentenceCount)
    }
  }
  static pastDate() {
    if (this.chromaticBuild()) {
      return new Date('2020-01-01T10:00:00.000Z')
    } else {
      return faker.date.past()
    }
  }
  static futureDate() {
    if (this.chromaticBuild()) {
      return new Date('2030-06-11T10:00:00.000Z')
    } else {
      return faker.date.future()
    }
  }
  static recentDate() {
    if (this.chromaticBuild()) {
      return new Date('2024-02-01T10:00:00.000Z')
    } else {
      return faker.date.recent()
    }
  }
  static getImageUrl(width?: number, height?: number) {
    if (this.chromaticBuild()) {
      return 'https://picsum.photos/id/237/200/300'
    } else {
      return `http://picsum.photos/id/237/${width ?? 200}/${height ?? 300}`
    }
  }

  static affiliation() {
    if (this.chromaticBuild()) {
      return 'Scientific Research University'
    } else {
      return faker.lorem.words(3)
    }
  }

  static collectionName() {
    if (this.chromaticBuild()) {
      return 'Collection Name'
    } else {
      return faker.lorem.words(3)
    }
  }
}

import { faker } from '@faker-js/faker'
import {
  File,
  FileDateType,
  FileEmbargo,
  FileLabel,
  FileLabelType,
  FileSize,
  FileSizeUnit,
  FilePublishingStatus,
  FileType,
  FileChecksum
} from '../../../../../src/files/domain/models/File'

const valueOrUndefined: <T>(value: T) => T | undefined = (value) => {
  const shouldShowValue = faker.datatype.boolean()
  return shouldShowValue ? value : undefined
}

const createFakeFileLabel = (): FileLabel => ({
  type: faker.helpers.arrayElement(Object.values(FileLabelType)),
  value: faker.lorem.word()
})

export class FileEmbargoMother {
  static create(dateAvailable?: Date): FileEmbargo {
    return new FileEmbargo(dateAvailable ?? faker.date.future())
  }

  static createNotActive(): FileEmbargo {
    const dateAvailable = faker.date.past()
    return new FileEmbargo(dateAvailable)
  }
}

export class FileChecksumMother {
  static create(props?: Partial<FileChecksum>): FileChecksum {
    return {
      algorithm: faker.lorem.word(),
      value: faker.datatype.uuid(),
      ...props
    }
  }
}

export class FileMother {
  static create(props?: Partial<File>): File {
    const thumbnail = valueOrUndefined<string>(faker.image.imageUrl())
    const fileType = faker.helpers.arrayElement(['tabular data', faker.system.fileType()])
    const checksum = valueOrUndefined<string>(faker.datatype.uuid())
    const fileMockedData = {
      id: faker.datatype.number(),
      name: faker.system.fileName(),
      access: {
        restricted: faker.datatype.boolean(),
        latestVersionRestricted: faker.datatype.boolean(),
        canBeRequested: faker.datatype.boolean(),
        requested: faker.datatype.boolean()
      },
      version: {
        number: faker.datatype.number(),
        publishingStatus: faker.helpers.arrayElement(Object.values(FilePublishingStatus))
      },
      type: new FileType(thumbnail ? 'image' : fileType),
      size: {
        value: faker.datatype.number({ max: 1024, precision: 2 }),
        unit: faker.helpers.arrayElement(Object.values(FileSizeUnit))
      },
      date: {
        type: faker.helpers.arrayElement(Object.values(FileDateType)),
        date: faker.date.recent()
      },
      downloadCount: faker.datatype.number(40),
      labels: faker.datatype.boolean()
        ? faker.helpers.arrayElements<FileLabel>([
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel()
          ])
        : [],
      checksum: FileChecksumMother.create(),
      thumbnail: thumbnail,
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>(FileEmbargoMother.create()),
      tabularData:
        fileType === 'tabular data' && !checksum
          ? {
              variablesCount: faker.datatype.number(100),
              observationsCount: faker.datatype.number(100),
              unf: `UNF:6:${faker.datatype.uuid()}==`
            }
          : undefined,
      description: valueOrUndefined<string>(faker.lorem.paragraph()),
      ...props
    }

    return new File(
      fileMockedData.id,
      fileMockedData.version,
      fileMockedData.name,
      fileMockedData.access,
      fileMockedData.type,
      new FileSize(fileMockedData.size.value, fileMockedData.size.unit),
      fileMockedData.date,
      fileMockedData.downloadCount,
      fileMockedData.labels,
      fileMockedData.checksum,
      fileMockedData.thumbnail,
      fileMockedData.directory,
      fileMockedData.embargo,
      fileMockedData.tabularData,
      fileMockedData.description
    )
  }

  static createMany(quantity: number): File[] {
    return Array.from({ length: quantity }).map(() => this.create())
  }

  static createDefault(props?: Partial<File>): File {
    const defaultFile = {
      type: new FileType('file'),
      version: {
        number: 1,
        publishingStatus: FilePublishingStatus.RELEASED
      },
      access: {
        restricted: false,
        latestVersionRestricted: false,
        canBeRequested: false,
        requested: false
      },
      permissions: { canDownload: true },
      labels: [],
      checksum: undefined,
      thumbnail: undefined,
      directory: undefined,
      embargo: undefined,
      tabularData: undefined,
      description: undefined,
      ...props
    }
    return this.create(defaultFile)
  }

  static createWithLabels(): File {
    return this.createDefault({
      labels: faker.helpers.arrayElements<FileLabel>([
        createFakeFileLabel(),
        createFakeFileLabel(),
        createFakeFileLabel(),
        createFakeFileLabel()
      ])
    })
  }

  static createWithDirectory(): File {
    return this.createDefault({ directory: faker.system.directoryPath() })
  }

  static createWithEmbargo(): File {
    return this.createDefault({
      embargo: FileEmbargoMother.create()
    })
  }

  static createWithEmbargoRestricted(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: false,
        requested: false
      },
      embargo: FileEmbargoMother.create()
    })
  }

  static createWithTabularData(): File {
    return this.createDefault({
      type: new FileType('tabular data'),
      tabularData: {
        variablesCount: faker.datatype.number(100),
        observationsCount: faker.datatype.number(100),
        unf: `UNF:${faker.datatype.uuid()}==`
      }
    })
  }

  static createWithDescription(): File {
    return this.createDefault({
      description: faker.lorem.paragraph()
    })
  }

  static createWithChecksum(): File {
    return this.createDefault({
      checksum: FileChecksumMother.create()
    })
  }

  static createWithPublicAccess(): File {
    return this.createDefault({
      access: {
        restricted: false,
        latestVersionRestricted: false,
        canBeRequested: false,
        requested: false
      },
      embargo: undefined
    })
  }

  static createWithPublicAccessButLatestVersionRestricted(): File {
    return this.createDefault({
      access: {
        restricted: false,
        latestVersionRestricted: true,
        canBeRequested: false,
        requested: false
      },
      embargo: undefined
    })
  }

  static createWithRestrictedAccess(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: false,
        requested: false
      },
      embargo: undefined
    })
  }

  static createWithRestrictedAccessWithAccessGranted(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: true,
        requested: false
      },
      embargo: undefined
    })
  }

  static createWithAccessRequestAllowed(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: true,
        requested: false
      },
      embargo: undefined
    })
  }

  static createWithAccessRequestPending(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: true,
        requested: true
      },
      embargo: undefined
    })
  }

  static createWithThumbnail(): File {
    return this.createDefault({
      thumbnail: faker.image.imageUrl()
    })
  }

  static createWithThumbnailRestrictedWithAccessGranted(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: true,
        requested: false
      },
      thumbnail: faker.image.imageUrl(),
      type: new FileType('image')
    })
  }

  static createWithThumbnailRestricted(): File {
    return this.createDefault({
      access: {
        restricted: true,
        latestVersionRestricted: true,
        canBeRequested: false,
        requested: false
      },
      thumbnail: faker.image.imageUrl(),
      type: new FileType('image')
    })
  }

  static createDeaccessioned(): File {
    return this.createDefault({
      version: {
        number: 1,
        publishingStatus: FilePublishingStatus.DEACCESSIONED
      }
    })
  }
}

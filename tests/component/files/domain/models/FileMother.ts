import { faker } from '@faker-js/faker'
import {
  File,
  FileDateType,
  FileEmbargo,
  FileIngest,
  FileIngestStatus,
  FileLabel,
  FileLabelType,
  FileSize,
  FileSizeUnit,
  FileStatus,
  FileType,
  FileVersion
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
  static create(): FileEmbargo {
    const dateAvailable = faker.date.future()
    return new FileEmbargo(dateAvailable)
  }

  static createNotActive(): FileEmbargo {
    const dateAvailable = faker.date.past()
    return new FileEmbargo(dateAvailable)
  }
}
export class FileIngestMother {
  static create(props?: Partial<FileIngest>): FileIngest {
    return {
      status: faker.helpers.arrayElement(Object.values(FileIngestStatus)),
      reportMessage: valueOrUndefined<string>(faker.lorem.sentence()),
      ...props
    }
  }

  static createInProgress(): FileIngest {
    return this.create({ status: FileIngestStatus.IN_PROGRESS })
  }

  static createIngestProblem(reportMessage?: string): FileIngest {
    return this.create({
      status: FileIngestStatus.ERROR,
      reportMessage: reportMessage
    })
  }
}

export class FileMother {
  static create(props?: Partial<File>): File {
    const thumbnail = valueOrUndefined<string>(faker.image.imageUrl())
    const fileType = faker.helpers.arrayElement(['tabular data', faker.system.fileType()])
    const checksum = valueOrUndefined<string>(faker.datatype.uuid())
    const fileMockedData = {
      id: faker.datatype.uuid(),
      name: faker.system.fileName(),
      access: {
        restricted: faker.datatype.boolean(),
        latestVersionRestricted: faker.datatype.boolean(),
        canBeRequested: faker.datatype.boolean(),
        requested: faker.datatype.boolean()
      },
      version: {
        majorNumber: faker.datatype.number(),
        minorNumber: faker.datatype.number(),
        status: faker.helpers.arrayElement(Object.values(FileStatus))
      },
      type: new FileType(thumbnail ? 'image' : fileType),
      size: {
        value: faker.datatype.number({ max: 1024, precision: 2 }),
        unit: faker.helpers.arrayElement(Object.values(FileSizeUnit))
      },
      date: {
        type: faker.helpers.arrayElement(Object.values(FileDateType)),
        date: faker.date.recent().toDateString()
      },
      downloads: faker.datatype.number(40),
      labels: faker.datatype.boolean()
        ? faker.helpers.arrayElements<FileLabel>([
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel()
          ])
        : [],
      checksum: checksum,
      thumbnail: thumbnail,
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>(FileEmbargoMother.create()),
      tabularData:
        fileType === 'tabular data' && !checksum
          ? {
              variablesCount: faker.datatype.number(100),
              observationsCount: faker.datatype.number(100),
              unf: `UNF:${faker.datatype.uuid()}==`
            }
          : undefined,
      description: valueOrUndefined<string>(faker.lorem.paragraph()),
      isDeleted: faker.datatype.boolean(),
      ingest: { status: FileIngestStatus.NONE },
      ...props
    }

    return new File(
      fileMockedData.id,
      new FileVersion(
        fileMockedData.version.majorNumber,
        fileMockedData.version.minorNumber,
        fileMockedData.version.status
      ),
      fileMockedData.name,
      fileMockedData.access,
      fileMockedData.type,
      new FileSize(fileMockedData.size.value, fileMockedData.size.unit),
      fileMockedData.date,
      fileMockedData.downloads,
      fileMockedData.labels,
      fileMockedData.isDeleted,
      fileMockedData.ingest,
      fileMockedData.checksum,
      fileMockedData.embargo,
      fileMockedData.directory,
      fileMockedData.description,
      fileMockedData.tabularData,
      fileMockedData.thumbnail
    )
  }

  static createMany(quantity: number): File[] {
    return Array.from({ length: quantity }).map(() => this.create())
  }

  static createDefault(props?: Partial<File>): File {
    const defaultFile = {
      type: new FileType('file'),
      version: {
        majorNumber: 1,
        minorNumber: 0,
        status: FileStatus.RELEASED
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
      isDeleted: false,
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
      checksum: faker.datatype.uuid()
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
        majorNumber: 1,
        minorNumber: 0,
        status: FileStatus.DEACCESSIONED
      }
    })
  }
  static createDeleted(): File {
    return this.createDefault({
      isDeleted: true
    })
  }

  static createIngestInProgress(): File {
    return this.createDefault({
      ingest: FileIngestMother.createInProgress()
    })
  }

  static createIngestProblem(reportMessage?: string): File {
    return this.createDefault({
      ingest: FileIngestMother.createIngestProblem(reportMessage)
    })
  }
}

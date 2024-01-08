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
  FilePublishingStatus,
  FileType,
  FileChecksum,
  FilePermissions
} from '../../../../../src/files/domain/models/File'
import FileTypeToFriendlyTypeMap from '../../../../../src/files/domain/models/FileTypeToFriendlyTypeMap'

const valueOrUndefined: <T>(value: T) => T | undefined = (value) => {
  const shouldShowValue = faker.datatype.boolean()
  return shouldShowValue ? value : undefined
}

const createFakeFileLabel = (): FileLabel => ({
  type: faker.helpers.arrayElement(Object.values(FileLabelType)),
  value: faker.lorem.word()
})
export class FilePermissionsMother {
  static create(props?: Partial<FilePermissions>): FilePermissions {
    return {
      canDownloadFile: faker.datatype.boolean(),
      canEditDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithFileDownloadAllowed(): FilePermissions {
    console.log('createWithFileDownloadAllowed')
    return this.create({ canDownloadFile: true })
  }

  static createWithFileDownloadNotAllowed(): FilePermissions {
    return this.create({ canDownloadFile: false })
  }
}
export class FileEmbargoMother {
  static create(dateAvailable?: Date): FileEmbargo {
    return new FileEmbargo(dateAvailable ?? faker.date.future())
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

  static createIngestNone(): FileIngest {
    return this.create({ status: FileIngestStatus.NONE })
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
    const fileType = faker.helpers.arrayElement(Object.keys(FileTypeToFriendlyTypeMap))
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
      type:
        fileType === 'text/tab-separated-values'
          ? new FileType('text/tab-separated-values', 'Comma Separated Values')
          : new FileType(thumbnail ? 'image' : fileType),
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
      filePermissions: FilePermissionsMother.create(),
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>(FileEmbargoMother.create()),
      tabularData:
        fileType === 'text/tab-separated-values' && !checksum
          ? {
              variablesCount: faker.datatype.number(100),
              observationsCount: faker.datatype.number(100),
              unf: `UNF:6:${faker.datatype.uuid()}==`
            }
          : undefined,
      description: valueOrUndefined<string>(faker.lorem.paragraph()),
      isDeleted: faker.datatype.boolean(),
      ingest: { status: FileIngestStatus.NONE },
      downloadUrls: {
        original: this.createDownloadUrl(),
        tabular: this.createDownloadUrl(),
        rData: this.createDownloadUrl()
      },
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
      fileMockedData.isDeleted,
      fileMockedData.ingest,
      fileMockedData.downloadUrls,
      fileMockedData.filePermissions,
      fileMockedData.thumbnail,
      fileMockedData.directory,
      fileMockedData.embargo,
      fileMockedData.tabularData,
      fileMockedData.description,
      fileMockedData.checksum
    )
  }

  static createDownloadUrl(): string {
    const blob = new Blob(['Name,Age,Location\nJohn,25,New York\nJane,30,San Francisco'], {
      type: 'text/csv'
    })
    return URL.createObjectURL(blob)
  }

  static createMany(quantity: number, props?: Partial<File>): File[] {
    return Array.from({ length: quantity }).map(() => this.create(props))
  }

  static createDefault(props?: Partial<File>): File {
    const defaultFile = {
      type: new FileType('text/plain'),
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
      filePermissions: {
        canDownloadFile: false,
        canEditDataset: false
      },
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

  static createTabular(props?: Partial<File>): File {
    return this.createDefault({
      type: new FileType('text/tab-separated-values', 'Comma Separated Values'),
      tabularData: {
        variablesCount: faker.datatype.number(100),
        observationsCount: faker.datatype.number(100),
        unf: `UNF:${faker.datatype.uuid()}==`
      },
      ...props
    })
  }

  static createNonTabular(props?: Partial<File>): File {
    console.log('createNonTabular', props)
    return this.createDefault({
      type: new FileType('text/plain'),
      tabularData: undefined,
      ...props
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

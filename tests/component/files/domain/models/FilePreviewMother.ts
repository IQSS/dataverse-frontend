import { faker } from '@faker-js/faker'
import {
  FilePreview,
  FileDateType,
  FileEmbargo,
  FileIngest,
  FileIngestStatus,
  FileSize,
  FileSizeUnit,
  FilePublishingStatus,
  FileType,
  FileChecksum,
  FileLabel,
  FileLabelType,
  FileTabularData,
  FileVersion
} from '../../../../../src/files/domain/models/FilePreview'
import FileTypeToFriendlyTypeMap from '../../../../../src/files/domain/models/FileTypeToFriendlyTypeMap'

const valueOrUndefined: <T>(value: T) => T | undefined = (value) => {
  const shouldShowValue = faker.datatype.boolean()
  return shouldShowValue ? value : undefined
}

export class FileTabularDataMother {
  static create(props?: Partial<FileTabularData>): FileTabularData {
    return {
      variablesCount: faker.datatype.number(100),
      observationsCount: faker.datatype.number(100),
      unf: `UNF:6:xXw6cIZnwHWvmRdwhYCQZA==`,
      ...props
    }
  }
}

export class FileLabelMother {
  static create(props?: Partial<FileLabel>): FileLabel {
    return {
      type: faker.helpers.arrayElement(Object.values(FileLabelType)),
      value: faker.lorem.word(),
      ...props
    }
  }

  static createMany(count: number): FileLabel[] {
    return Array.from({ length: count }).map(() => this.create())
  }
}

export class FileEmbargoMother {
  static create(props?: Partial<FileEmbargo>): FileEmbargo {
    return new FileEmbargo(
      props?.dateAvailable ?? faker.date.future(),
      props?.reason ?? faker.lorem.sentence()
    )
  }

  static createWithNoReason(props?: Partial<FileEmbargo>): FileEmbargo {
    return new FileEmbargo(props?.dateAvailable ?? faker.date.future(), undefined)
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

  static createRealistic(props?: Partial<FileChecksum>): FileChecksum {
    return {
      algorithm: 'MD5',
      value: 'd41d8cd98f00b204e9800998ecf8427e',
      ...props
    }
  }
}

export class FileVersionMother {
  static create(props?: Partial<FileVersion>): FileVersion {
    return {
      number: faker.datatype.number(),
      publishingStatus: faker.helpers.arrayElement(Object.values(FilePublishingStatus)),
      ...props
    }
  }

  static createReleased(props?: Partial<FileVersion>): FileVersion {
    return this.create({
      publishingStatus: FilePublishingStatus.RELEASED,
      ...props
    })
  }

  static createDeaccessioned(props?: Partial<FileVersion>): FileVersion {
    return this.create({
      publishingStatus: FilePublishingStatus.DEACCESSIONED,
      ...props
    })
  }
}

export class FilePreviewMother {
  static create(props?: Partial<FilePreview>): FilePreview {
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
      version: FileVersionMother.create(),
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
      labels: faker.datatype.boolean() ? FileLabelMother.createMany(3) : [],
      checksum: FileChecksumMother.create(),
      thumbnail: thumbnail,
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>(FileEmbargoMother.create()),
      tabularData:
        fileType === 'text/tab-separated-values' && !checksum
          ? FileTabularDataMother.create()
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

    return new FilePreview(
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

  static createMany(quantity: number, props?: Partial<FilePreview>): FilePreview[] {
    return Array.from({ length: quantity }).map(() => this.create(props))
  }

  static createDefault(props?: Partial<FilePreview>): FilePreview {
    const defaultFile = {
      type: new FileType('text/plain'),
      version: FileVersionMother.createReleased(),
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

  static createWithLabels(): FilePreview {
    return this.createDefault({ labels: FileLabelMother.createMany(4) })
  }

  static createWithDirectory(): FilePreview {
    return this.createDefault({ directory: faker.system.directoryPath() })
  }

  static createWithEmbargo(): FilePreview {
    return this.createDefault({
      embargo: FileEmbargoMother.create()
    })
  }

  static createWithEmbargoRestricted(): FilePreview {
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

  static createTabular(props?: Partial<FilePreview>): FilePreview {
    return this.createDefault({
      type: new FileType('text/tab-separated-values', 'Comma Separated Values'),
      tabularData: FileTabularDataMother.create(),
      ...props
    })
  }

  static createNonTabular(props?: Partial<FilePreview>): FilePreview {
    return this.createDefault({
      type: new FileType('text/plain'),
      tabularData: undefined,
      ...props
    })
  }

  static createWithDescription(): FilePreview {
    return this.createDefault({
      description: faker.lorem.paragraph()
    })
  }

  static createWithChecksum(): FilePreview {
    return this.createDefault({
      checksum: FileChecksumMother.create()
    })
  }

  static createWithPublicAccess(): FilePreview {
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

  static createWithPublicAccessButLatestVersionRestricted(): FilePreview {
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

  static createWithRestrictedAccess(): FilePreview {
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

  static createWithRestrictedAccessWithAccessGranted(): FilePreview {
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

  static createWithAccessRequestAllowed(): FilePreview {
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

  static createWithAccessRequestPending(): FilePreview {
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

  static createWithThumbnail(): FilePreview {
    return this.createDefault({
      thumbnail: faker.image.imageUrl()
    })
  }

  static createWithThumbnailRestrictedWithAccessGranted(): FilePreview {
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

  static createWithThumbnailRestricted(): FilePreview {
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

  static createDeaccessioned(): FilePreview {
    return this.createDefault({
      version: FileVersionMother.createDeaccessioned()
    })
  }
  static createDeleted(): FilePreview {
    return this.createDefault({
      isDeleted: true
    })
  }

  static createIngestInProgress(): FilePreview {
    return this.createDefault({
      ingest: FileIngestMother.createInProgress()
    })
  }

  static createIngestProblem(reportMessage?: string): FilePreview {
    return this.createDefault({
      ingest: FileIngestMother.createIngestProblem(reportMessage)
    })
  }
}

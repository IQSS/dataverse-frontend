import { faker } from '@faker-js/faker'
import {
  FileEmbargo,
  FileSize,
  FileType,
  FileChecksum,
  FileLabel,
  FileLabelType,
  FileTabularData,
  FileMetadata,
  FileDownloadUrls
} from '../../../../../src/files/domain/models/FileMetadata'
import FileTypeToFriendlyTypeMap from '../../../../../src/files/domain/models/FileTypeToFriendlyTypeMap'
import { FakerHelper } from '../../../shared/FakerHelper'

const valueOrUndefined: <T>(value: T) => T | undefined = (value) => {
  const shouldShowValue = faker.datatype.boolean()
  return shouldShowValue ? value : undefined
}

export class FileTypeMother {
  static create(props?: Partial<FileType>): FileType {
    return new FileType(
      props?.value ?? faker.helpers.arrayElement(Object.keys(FileTypeToFriendlyTypeMap)),
      props?.original
    )
  }

  static createTabular(): FileType {
    return new FileType('text/tab-separated-values', 'Comma Separated Values')
  }

  static createTabularUnknown(): FileType {
    return new FileType('text/tab-separated-values', 'Unknown')
  }

  static createText(): FileType {
    return new FileType('text/plain')
  }

  static createImage(): FileType {
    return new FileType('image')
  }

  static createRealistic(): FileType {
    return new FileType('text/csv', 'Comma Separated Values')
  }

  static createUnknown(): FileType {
    return new FileType('unknown')
  }

  static createRData(): FileType {
    return new FileType('text/tab-separated-values', 'R Data')
  }
}

export class FileTabularDataMother {
  static create(props?: Partial<FileTabularData>): FileTabularData {
    return {
      variables: faker.datatype.number(100),
      observations: faker.datatype.number(100),
      unf: `UNF:6:xXw6cIZnwHWvmRdwhYCQZA==`,
      ...props
    }
  }
}

export class FileLabelMother {
  static create(props?: Partial<FileLabel>): FileLabel {
    return FakerHelper.fileLabel(props)
  }

  static createMany(count: number): FileLabel[] {
    return Array.from({ length: count }).map(() => this.create())
  }

  static createManyRealistic(): FileLabel[] {
    return [
      { value: 'Category 1', type: FileLabelType.CATEGORY },
      { value: 'Tag 1', type: FileLabelType.TAG },
      { value: 'Tag 2', type: FileLabelType.TAG }
    ]
  }
}

export class FileEmbargoMother {
  static create(props?: Partial<FileEmbargo>): FileEmbargo {
    return new FileEmbargo(
      props?.dateAvailable ?? FakerHelper.futureDate(),
      props?.reason ?? faker.lorem.sentence()
    )
  }

  static createWithNoReason(props?: Partial<FileEmbargo>): FileEmbargo {
    return new FileEmbargo(props?.dateAvailable ?? FakerHelper.futureDate(), undefined)
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

export class FileSizeMother {
  static create(props?: Partial<FileSize>): FileSize {
    return FakerHelper.fileSize(props)
  }
}

export class FileDownloadUrlsMother {
  static create(props?: Partial<FileDownloadUrls>): FileDownloadUrls {
    return {
      original: faker.internet.url(),
      tabular: faker.internet.url(),
      rData: faker.internet.url(),
      ...props
    }
  }
}

export class FileMetadataMother {
  static create(props?: Partial<FileMetadata>): FileMetadata {
    const thumbnail = valueOrUndefined<string>(FakerHelper.getImageUrl(400))
    const tabularFile = faker.datatype.boolean()
    const checksum = valueOrUndefined<string>(faker.datatype.uuid())
    const fileMockedData = {
      id: faker.datatype.number(),
      type: tabularFile ? FileTypeMother.createTabular() : FileTypeMother.create(),
      size: FileSizeMother.create(),
      date: {
        type: FakerHelper.fileDateType(),
        date: '2024-02-01'
      },
      downloadCount: FakerHelper.smallNumber(40),
      labels: faker.datatype.boolean() ? FileLabelMother.createMany(3) : [],
      checksum: FileChecksumMother.create(),
      thumbnail: thumbnail,
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>(FileEmbargoMother.create()),
      tabularData: tabularFile && !checksum ? FileTabularDataMother.create() : undefined,
      description: valueOrUndefined<string>(faker.lorem.paragraph()),
      isDeleted: faker.datatype.boolean(),
      downloadUrls: FileDownloadUrlsMother.create(),
      depositDate: '2020-01-01',
      publicationDate: faker.datatype.boolean() ? '2020-01-01' : undefined,
      persistentId: faker.datatype.uuid(),
      ...props
    }

    return new FileMetadata(
      fileMockedData.type,
      fileMockedData.size,
      fileMockedData.date,
      fileMockedData.downloadCount,
      fileMockedData.labels,
      fileMockedData.isDeleted,
      fileMockedData.downloadUrls,
      fileMockedData.depositDate,
      fileMockedData.publicationDate,
      fileMockedData.thumbnail,
      fileMockedData.directory,
      fileMockedData.embargo,
      fileMockedData.tabularData,
      fileMockedData.description,
      fileMockedData.checksum,
      fileMockedData.persistentId,
      fileMockedData.storageIdentifier
    )
  }

  static createDownloadUrl(): string {
    const blob = new Blob(['Name,Age,Location\nJohn,25,New York\nJane,30,San Francisco'], {
      type: 'text/csv'
    })
    return URL.createObjectURL(blob)
  }

  static createDefault(props?: Partial<FileMetadata>): FileMetadata {
    const defaultFile = {
      type: FileTypeMother.createText(),
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

  static createWithLabels(): FileMetadata {
    return this.createDefault({ labels: FileLabelMother.createMany(4) })
  }

  static createWithLabelsRealistic(): FileMetadata {
    return this.createDefault({ labels: FileLabelMother.createManyRealistic() })
  }

  static createWithNoLabels(): FileMetadata {
    return this.createDefault({ labels: [] })
  }

  static createWithDirectory(): FileMetadata {
    return this.createDefault({ directory: FakerHelper.directoryPath() })
  }

  static createWithNoDirectory(): FileMetadata {
    return this.createDefault({ directory: undefined })
  }

  static createWithEmbargo(): FileMetadata {
    return this.createDefault({
      embargo: FileEmbargoMother.create()
    })
  }

  static createNotEmbargoed(): FileMetadata {
    return this.createDefault({
      embargo: undefined
    })
  }

  static createTabular(props?: Partial<FileMetadata>): FileMetadata {
    return this.createDefault({
      description: FakerHelper.paragraph(),
      type: FileTypeMother.createTabular(),
      tabularData: FileTabularDataMother.create(),
      checksum: FileChecksumMother.create(),
      ...props
    })
  }

  static createNonTabular(props?: Partial<FileMetadata>): FileMetadata {
    return this.createDefault({
      description: FakerHelper.paragraph(),
      type: FileTypeMother.createText(),
      tabularData: undefined,
      ...props
    })
  }

  static createNonTabularUnknown(props?: Partial<FileMetadata>): FileMetadata {
    return this.createNonTabular({
      type: FileTypeMother.createUnknown(),
      ...props
    })
  }

  static createWithDescription(props?: Partial<FileMetadata>): FileMetadata {
    return this.createDefault({
      description: FakerHelper.paragraph(),
      ...props
    })
  }

  static createWithNoDescription(): FileMetadata {
    return this.createDefault({
      description: undefined
    })
  }

  static createWithChecksum(): FileMetadata {
    return this.createDefault({
      checksum: FileChecksumMother.create(),
      description: FakerHelper.paragraph()
    })
  }

  static createWithNoChecksum(): FileMetadata {
    return this.createDefault({
      checksum: undefined,
      description: FakerHelper.paragraph()
    })
  }

  static createWithThumbnail(): FileMetadata {
    return this.createDefault({
      thumbnail: FakerHelper.getImageUrl(400),
      type: FileTypeMother.createImage()
    })
  }

  static createWithoutThumbnail(props?: Partial<FileMetadata>): FileMetadata {
    return this.createDefault({
      thumbnail: undefined,
      ...props
    })
  }

  static createDeleted(): FileMetadata {
    return this.createDefault({
      isDeleted: true
    })
  }

  static createWithNoPersistentId(): FileMetadata {
    return this.createDefault({
      persistentId: undefined
    })
  }

  static createWithPublicationDate(props?: Partial<FileMetadata>): FileMetadata {
    return this.createDefault({
      publicationDate: '2020-01-01',
      ...props
    })
  }

  static createWithNoPublicationDate(): FileMetadata {
    return this.createDefault({
      publicationDate: undefined
    })
  }

  static createWithPublicationDateNotEmbargoed(): FileMetadata {
    return this.createWithPublicationDate({
      embargo: undefined
    })
  }

  static createWithPublicationDateEmbargoed(): FileMetadata {
    return this.createWithPublicationDate({
      embargo: FileEmbargoMother.create()
    })
  }
}

import { faker } from '@faker-js/faker'
import { FileIngest, FileIngestStatus } from '../../../../../src/files/domain/models/FileIngest'

export class FileIngestMother {
  static create(props?: Partial<FileIngest>): FileIngest {
    return new FileIngest(
      props?.status ?? faker.helpers.arrayElement(Object.values(FileIngestStatus)),
      props?.message
    )
  }

  static createInProgress(): FileIngest {
    return this.create({ status: FileIngestStatus.IN_PROGRESS })
  }

  static createIngestProblem(message?: string): FileIngest {
    return this.create({
      status: FileIngestStatus.ERROR,
      message: message
    })
  }

  static createIngestNone(): FileIngest {
    return this.create({ status: FileIngestStatus.NONE })
  }
}

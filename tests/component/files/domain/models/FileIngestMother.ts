import { faker } from '@faker-js/faker'
import { FileIngest, FileIngestStatus } from '../../../../../src/files/domain/models/FileIngest'

export class FileIngestMother {
  static create(props?: Partial<FileIngest>): FileIngest {
    return {
      status: faker.helpers.arrayElement(Object.values(FileIngestStatus)),
      reportMessage: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
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

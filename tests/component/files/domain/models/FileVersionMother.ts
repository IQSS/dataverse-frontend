import { faker } from '@faker-js/faker'
import {
  FilePublishingStatus,
  FileVersion
} from '../../../../../src/files/domain/models/FileVersion'

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

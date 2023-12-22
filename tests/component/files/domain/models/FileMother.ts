import { File } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'

export class FileMother {
  static create(props?: Partial<File>): File {
    return {
      name: faker.system.fileName(),
      datasetVersion: DatasetVersionMother.create(),
      restricted: faker.datatype.boolean(),
      permissions: {
        canDownloadFile: faker.datatype.boolean()
      },
      ...props
    }
  }

  static createRealistic(props?: Partial<File>): File {
    return this.create({
      name: 'file.csv',
      datasetVersion: DatasetVersionMother.createRealistic(),
      restricted: false,
      permissions: {
        canDownloadFile: true
      },
      ...props
    })
  }

  static createRestricted(props?: Partial<File>): File {
    return this.createRealistic({
      restricted: true,
      permissions: {
        canDownloadFile: false
      },
      ...props
    })
  }

  static createRestrictedWithAccessGranted(props?: Partial<File>): File {
    return this.createRestricted({
      permissions: {
        canDownloadFile: true
      },
      ...props
    })
  }
}

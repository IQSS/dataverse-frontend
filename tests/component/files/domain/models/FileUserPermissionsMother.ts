import { FileUserPermissions } from '../../../../../src/files/domain/models/FileUserPermissions'
import { faker } from '@faker-js/faker'

export class FileUserPermissionsMother {
  static create(props?: Partial<FileUserPermissions>): FileUserPermissions {
    return {
      fileId: faker.datatype.number(),
      canDownloadFile: faker.datatype.boolean(),
      canEditDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithAllPermissionsGranted(): FileUserPermissions {
    return this.create({
      canDownloadFile: true,
      canEditDataset: true
    })
  }

  static createWithAllPermissionsDenied(): FileUserPermissions {
    return this.create({
      canDownloadFile: false,
      canEditDataset: false
    })
  }

  static createWithDownloadFileGranted(): FileUserPermissions {
    return this.create({ canDownloadFile: true })
  }

  static createWithDownloadFileDenied(): FileUserPermissions {
    return this.create({ canDownloadFile: false })
  }
}

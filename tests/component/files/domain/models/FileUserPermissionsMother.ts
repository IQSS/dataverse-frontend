import { FilePermissions } from '../../../../../src/files/domain/models/FilePermissions'
import { faker } from '@faker-js/faker'

export class FileUserPermissionsMother {
  static create(props?: Partial<FilePermissions>): FilePermissions {
    return {
      fileId: faker.datatype.number(),
      canDownloadFile: faker.datatype.boolean(),
      canEditDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithGrantedPermissions(): FilePermissions {
    return FileUserPermissionsMother.create({
      canDownloadFile: true,
      canEditDataset: true
    })
  }

  static createWithDeniedPermissions(): FilePermissions {
    return FileUserPermissionsMother.create({
      canDownloadFile: false,
      canEditDataset: false
    })
  }
}

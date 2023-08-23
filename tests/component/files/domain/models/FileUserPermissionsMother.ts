import { FileUserPermissions } from '../../../../../src/files/domain/models/FileUserPermissions'
import { faker } from '@faker-js/faker'

export class FileUserPermissionsMother {
  static create(props?: Partial<FileUserPermissions>): FileUserPermissions {
    return {
      fileId: faker.datatype.uuid(),
      canDownloadFile: faker.datatype.boolean(),
      canEditDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithGrantedPermissions(): FileUserPermissions {
    return FileUserPermissionsMother.create({
      canDownloadFile: true,
      canEditDataset: true
    })
  }

  static createWithDeniedPermissions(): FileUserPermissions {
    return FileUserPermissionsMother.create({
      canDownloadFile: false,
      canEditDataset: false
    })
  }
}

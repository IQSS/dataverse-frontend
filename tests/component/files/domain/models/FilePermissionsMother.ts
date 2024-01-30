import { FilePermissions } from '../../../../../src/files/domain/models/FilePermissions'
import { faker } from '@faker-js/faker'

export class FilePermissionsMother {
  static create(props?: Partial<FilePermissions>): FilePermissions {
    return {
      canDownloadFile: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithGrantedPermissions(): FilePermissions {
    return FilePermissionsMother.create({
      canDownloadFile: true
    })
  }

  static createWithDeniedPermissions(): FilePermissions {
    return FilePermissionsMother.create({
      canDownloadFile: false
    })
  }
}

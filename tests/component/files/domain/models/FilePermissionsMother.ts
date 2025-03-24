import { FilePermissions } from '../../../../../src/files/domain/models/FilePermissions'
import { faker } from '@faker-js/faker'

export class FilePermissionsMother {
  static create(props?: Partial<FilePermissions>): FilePermissions {
    return {
      canDownloadFile: faker.datatype.boolean(),
      canManageFilePermissions: faker.datatype.boolean(),
      canEditOwnerDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithGrantedPermissions(): FilePermissions {
    return FilePermissionsMother.create({
      canDownloadFile: true,
      canManageFilePermissions: true,
      canEditOwnerDataset: true
    })
  }

  static createWithDeniedPermissions(): FilePermissions {
    return FilePermissionsMother.create({
      canDownloadFile: false,
      canManageFilePermissions: false,
      canEditOwnerDataset: false
    })
  }

  static createWithDownloadFileGranted(): FilePermissions {
    return this.create({ canDownloadFile: true })
  }

  static createWithDownloadFileDenied(): FilePermissions {
    return this.create({ canDownloadFile: false })
  }

  static createWithManageFilePermissionsGranted(): FilePermissions {
    return this.create({ canManageFilePermissions: true })
  }

  static createWithManageFilePermissionsDenied(): FilePermissions {
    return this.create({ canManageFilePermissions: false })
  }

  static createWithEditOwnerDatasetGranted(): FilePermissions {
    return this.create({ canEditOwnerDataset: true })
  }

  static createWithEditOwnerDatasetDenied(): FilePermissions {
    return this.create({ canEditOwnerDataset: false })
  }
}

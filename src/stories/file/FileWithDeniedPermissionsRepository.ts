import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePermissionsMother } from '../../../tests/component/files/domain/models/FilePermissionsMother'
import { FilePermissions } from '../../files/domain/models/FilePermissions'
import { FileMockRepository } from './FileMockRepository'

export class FileWithDeniedPermissionsRepository
  extends FileMockRepository
  implements FileRepository
{
  // eslint-disable-next-line unused-imports/no-unused-vars
  getUserPermissionsById(id: number): Promise<FilePermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilePermissionsMother.createWithDeniedPermissions())
      }, 1000)
    })
  }
}

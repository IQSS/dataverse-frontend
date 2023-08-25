import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'
import { FileUserPermissions } from '../../files/domain/models/FileUserPermissions'
import { FileMockRepository } from './FileMockRepository'

export class FileWithDeniedPermissionsRepository
  extends FileMockRepository
  implements FileRepository
{
  // eslint-disable-next-line unused-imports/no-unused-vars
  getFileUserPermissionsById(id: number): Promise<FileUserPermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileUserPermissionsMother.createWithDeniedPermissions())
      }, 1000)
    })
  }
}

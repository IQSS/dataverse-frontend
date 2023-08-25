import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { File } from '../../files/domain/models/File'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FileUserPermissions } from '../../files/domain/models/FileUserPermissions'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'

export class FileMockLoadingRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(persistentId: string, version?: string): Promise<File[]> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, 0)
    })
  }
  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string
  ): Promise<FilesCountInfo> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, 1000)
    })
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  getFileUserPermissionsById(id: number): Promise<FileUserPermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileUserPermissionsMother.create())
      }, 1000)
    })
  }
}

import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { File } from '../../files/domain/models/File'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'

export class FileMockNoDataRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(persistentId: string, version?: string): Promise<File[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1000)
    })
  }
  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.createEmpty())
      }, 1000)
    })
  }
}

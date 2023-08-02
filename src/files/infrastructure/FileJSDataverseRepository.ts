import { FileRepository } from '../domain/repositories/FileRepository'
import { File } from '../domain/models/File'
import { FilesMockData } from '../../stories/files/FileMockData'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'

export class FileJSDataverseRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(
    persistentId: string,
    version?: string,
    paginationInfo?: FilePaginationInfo
  ): Promise<File[]> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData())
      }, 1000)
    })
  }
  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string
  ): Promise<FilesCountInfo> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.create())
      }, 1000)
    })
  }
}

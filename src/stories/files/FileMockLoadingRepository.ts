import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { File } from '../../files/domain/models/File'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'

export class FileMockLoadingRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<File[]> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, 0)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion,
    // eslint-disable-next-line unused-imports/no-unused-vars
    criteria?: FileCriteria
  ): Promise<FilesCountInfo> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, 1000)
    })
  }
}

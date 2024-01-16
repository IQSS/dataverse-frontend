import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilesMockData } from './FileMockData'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'

export class FileMockNoFiltersRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData())
      }, 1000)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersionNumber: DatasetVersionNumber,
    // eslint-disable-next-line unused-imports/no-unused-vars
    criteria?: FileCriteria
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.createOnlyTotal())
      }, 1000)
    })
  }
}
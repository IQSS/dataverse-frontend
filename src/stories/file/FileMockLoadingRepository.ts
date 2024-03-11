import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../files/domain/models/File'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export class FileMockLoadingRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
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
    datasetVersionNumber: DatasetVersionNumber,
    // eslint-disable-next-line unused-imports/no-unused-vars
    criteria?: FileCriteria
  ): Promise<FilesCountInfo> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: number): Promise<File> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }
}

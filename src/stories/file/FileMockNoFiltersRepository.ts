import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilesMockData } from './FileMockData'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export class FileMockNoFiltersRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData())
      }, FakerHelper.loadingTimout())
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersionNumber: DatasetVersionNumber,
    _criteria?: FileCriteria
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.createOnlyTotal())
      }, FakerHelper.loadingTimout())
    })
  }
}

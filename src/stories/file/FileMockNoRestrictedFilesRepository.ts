import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FileAccessOption } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { DatasetVersionNumber } from '@/dataset/domain/models/Dataset'

export class FileMockNoRestrictedFilesRepository
  extends FileMockRepository
  implements FileRepository
{
  getFilesCountInfoByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersionNumber: DatasetVersionNumber
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          FilesCountInfoMother.create({
            perAccess: [
              { access: FileAccessOption.PUBLIC, count: 222 },
              { access: FileAccessOption.RESTRICTED, count: 0 }
            ]
          })
        )
      }, 1000)
    })
  }
}

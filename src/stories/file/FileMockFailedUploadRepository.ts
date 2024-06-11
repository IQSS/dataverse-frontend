import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FileMockRepository } from './FileMockRepository'
import { FileHolder } from '../../files/domain/repositories/File'

export class FileMocFailedRepository extends FileMockRepository implements FileRepository {
  uploadFile(
    _datasetId: number | string,
    _file: FileHolder,
    _progress: (now: number) => void,
    _abortController: AbortController
  ): Promise<void> {
    return Promise.reject(new Error('fail'))
  }
}

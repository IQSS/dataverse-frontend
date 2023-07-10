import { FileRepository } from '../domain/repositories/FileRepository'
import { File } from '../domain/models/File'
import { FilesMockData } from '../../stories/files/FileMockData'

export class FileJSDataverseRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(persistentId: string, version?: string): Promise<File[]> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData())
      }, 1000)
    })
  }
}

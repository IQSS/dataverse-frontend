import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'

export interface FileRepository {
  getAllByDatasetPersistentId: (
    datasetPersistentId: string,
    version?: string,
    criteria?: FileCriteria
  ) => Promise<File[]>
}

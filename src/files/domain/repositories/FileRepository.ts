import { File } from '../models/File'

export interface FileRepository {
  getAllByDatasetPersistentId: (datasetPersistentId: string, version?: string) => Promise<File[]>
}

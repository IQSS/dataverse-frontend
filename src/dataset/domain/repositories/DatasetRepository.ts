import { Dataset } from '../models/Dataset'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  getAll: () => Promise<Dataset[]>
}

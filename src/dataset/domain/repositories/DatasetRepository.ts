import { Dataset } from '../models/Dataset'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>

  // Created as placeholder for https://github.com/IQSS/dataverse-frontend/pull/251
  // postCreateDataset: (form: Dataset) => Promise<void>
}

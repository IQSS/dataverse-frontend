import { Dataset } from '../models/Dataset'

export interface DatasetRepository {
  getById: (id: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
}

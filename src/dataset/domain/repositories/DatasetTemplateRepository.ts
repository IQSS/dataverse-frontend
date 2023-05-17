import { DatasetTemplate } from '../models/DatasetTemplate'

export interface DatasetTemplateRepository {
  getById: (id: string) => Promise<DatasetTemplate | undefined>
}

import { DatasetTemplate } from '@/dataset/domain/models/DatasetTemplate'

export interface TemplateRepository {
  getDatasetTemplates: (collectionIdOrAlias: number | string) => Promise<DatasetTemplate[]>
}

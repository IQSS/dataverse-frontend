import { CreateDatasetTemplateDTO } from '@iqss/dataverse-client-javascript'
import { Template } from '@/dataset/domain/models/DatasetTemplate'

export interface TemplateRepository {
  createDatasetTemplate: (
    template: CreateDatasetTemplateDTO,
    collectionIdOrAlias: number | string
  ) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getDatasetTemplates: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
}

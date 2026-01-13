import { CreateTemplateDTO } from '@iqss/dataverse-client-javascript'
import { Template } from '@/dataset/domain/models/DatasetTemplate'

export interface TemplateRepository {
  createTemplate: (
    template: CreateTemplateDTO,
    collectionIdOrAlias: number | string
  ) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getTemplatesByCollectionId: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
}

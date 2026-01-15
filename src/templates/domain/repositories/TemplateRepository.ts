import { CreateTemplateDTO } from '@iqss/dataverse-client-javascript'
import { Template } from '@/templates/domain/models/Template'

export interface TemplateRepository {
  createTemplate: (template: TemplateInfo, collectionIdOrAlias: number | string) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getTemplatesByCollectionId: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
}

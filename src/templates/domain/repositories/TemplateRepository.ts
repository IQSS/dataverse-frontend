import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { Template } from '@/dataset/domain/models/DatasetTemplate'

export interface TemplateRepository {
  createTemplate: (template: TemplateInfo, collectionIdOrAlias: number | string) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getTemplatesByCollectionId: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
}

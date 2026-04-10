import { Template } from '@/templates/domain/models/Template'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'

export interface TemplateRepository {
  createTemplate: (template: TemplateInfo, collectionIdOrAlias: number | string) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getTemplatesByCollectionId: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
  setTemplateAsDefault: (templateId: number, collectionIdOrAlias: number | string) => Promise<void>
  unsetTemplateAsDefault: (collectionIdOrAlias: number | string) => Promise<void>
}

import {
  CreateTemplateDTO,
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplatesByCollectionId
} from '@iqss/dataverse-client-javascript'
import { Template } from '@/templates/domain/models/Template'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'

export class TemplateJSDataverseRepository implements TemplateRepository {
  createTemplate(template: CreateTemplateDTO, collectionIdOrAlias: number | string): Promise<void> {
    return createTemplate.execute(template, collectionIdOrAlias)
  }

  getTemplate(templateId: number): Promise<Template> {
    return getTemplate.execute(templateId)
  }

  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]> {
    return getTemplatesByCollectionId.execute(collectionIdOrAlias)
  }

  deleteTemplate(templateId: number): Promise<void> {
    return deleteTemplate.execute(templateId)
  }
}

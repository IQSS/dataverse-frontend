import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplatesByCollectionId
} from '@iqss/dataverse-client-javascript'
import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'

export class TemplateJSDataverseRepository implements TemplateRepository {
  createTemplate(template: TemplateInfo, collectionIdOrAlias: number | string): Promise<void> {
    return createTemplate.execute(
      template as Parameters<typeof createTemplate.execute>[0],
      collectionIdOrAlias
    )
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

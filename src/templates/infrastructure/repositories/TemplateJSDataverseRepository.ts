import {
  CreateDatasetTemplateDTO,
  createTemplate,
  deleteTemplate,
  getDatasetTemplates,
  getTemplate
} from '@iqss/dataverse-client-javascript'
import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'

export class TemplateJSDataverseRepository implements TemplateRepository {
  createDatasetTemplate(
    template: CreateDatasetTemplateDTO,
    collectionIdOrAlias: number | string
  ): Promise<void> {
    return createTemplate.execute(template, collectionIdOrAlias)
  }

  getTemplate(templateId: number): Promise<Template> {
    return getTemplate.execute(templateId)
  }

  getDatasetTemplates(collectionIdOrAlias: number | string): Promise<Template[]> {
    return getDatasetTemplates.execute(collectionIdOrAlias)
  }

  deleteTemplate(templateId: number): Promise<void> {
    return deleteTemplate.execute(templateId)
  }
}

import { CreateDatasetTemplateDTO } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function createTemplate(
  templateRepository: TemplateRepository,
  template: CreateDatasetTemplateDTO,
  collectionIdOrAlias: number | string
): Promise<void> {
  return templateRepository.createTemplate(template, collectionIdOrAlias)
}

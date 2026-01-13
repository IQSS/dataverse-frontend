import { CreateTemplateDTO } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function createTemplate(
  templateRepository: TemplateRepository,
  template: CreateTemplateDTO,
  collectionIdOrAlias: number | string
): Promise<void> {
  return templateRepository.createTemplate(template, collectionIdOrAlias)
}

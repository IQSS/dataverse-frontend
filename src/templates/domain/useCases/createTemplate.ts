import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function createTemplate(
  templateRepository: TemplateRepository,
  template: TemplateInfo,
  collectionIdOrAlias: number | string
): Promise<void> {
  return templateRepository.createTemplate(template, collectionIdOrAlias)
}

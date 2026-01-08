import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '../models/DatasetTemplate'

export function getDatasetTemplates(
  templateRepository: TemplateRepository,
  collectionIdOrAlias: number | string
): Promise<Template[]> {
  return templateRepository.getDatasetTemplates(collectionIdOrAlias)
}

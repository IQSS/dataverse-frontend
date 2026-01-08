import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { DatasetTemplate } from '../models/DatasetTemplate'

export function getDatasetTemplates(
  templateRepository: TemplateRepository,
  collectionIdOrAlias: number | string
): Promise<DatasetTemplate[]> {
  return templateRepository.getDatasetTemplates(collectionIdOrAlias)
}

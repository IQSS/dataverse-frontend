import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function getTemplatesByCollectionId(
  templateRepository: TemplateRepository,
  collectionIdOrAlias: number | string
): Promise<Template[]> {
  return templateRepository.getTemplatesByCollectionId(collectionIdOrAlias)
}

import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'

export function getTemplatesByCollectionId(
  templateRepository: TemplateRepository,
  collectionIdOrAlias: number | string
): Promise<Template[]> {
  return templateRepository.getTemplatesByCollectionId(collectionIdOrAlias)
}

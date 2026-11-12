import { TemplateRepository } from '../repositories/TemplateRepository'

export function unsetTemplateAsDefault(
  templateRepository: TemplateRepository,
  collectionIdOrAlias: number | string
): Promise<void> {
  return templateRepository.unsetTemplateAsDefault(collectionIdOrAlias)
}

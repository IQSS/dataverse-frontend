import { TemplateRepository } from '../repositories/TemplateRepository'

export function setTemplateAsDefault(
  templateRepository: TemplateRepository,
  templateId: number,
  collectionIdOrAlias: number | string
): Promise<void> {
  return templateRepository.setTemplateAsDefault(templateId, collectionIdOrAlias)
}

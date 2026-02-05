import { TemplateRepository } from '../repositories/TemplateRepository'

export function deleteTemplate(
  templateRepository: TemplateRepository,
  templateId: number
): Promise<void> {
  return templateRepository.deleteTemplate(templateId)
}

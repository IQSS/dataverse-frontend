import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function getTemplate(
  templateRepository: TemplateRepository,
  templateId: number
): Promise<Template> {
  return templateRepository.getTemplate(templateId)
}

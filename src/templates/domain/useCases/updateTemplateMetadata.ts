import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function updateTemplateMetadata(
  templateRepository: TemplateRepository,
  templateId: number,
  payload: UpdateTemplateMetadataInfo,
  replace = true
): Promise<void> {
  return templateRepository.updateTemplateMetadata(templateId, payload, replace)
}

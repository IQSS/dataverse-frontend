import { UpdateTemplateLicenseTermsInfo } from '@/templates/domain/models/UpdateTemplateLicenseTermsInfo'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function updateTemplateLicenseTerms(
  templateRepository: TemplateRepository,
  templateId: number,
  payload: UpdateTemplateLicenseTermsInfo
): Promise<void> {
  return templateRepository.updateTemplateLicenseTerms(templateId, payload)
}

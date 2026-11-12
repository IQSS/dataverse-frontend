import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { TemplateRepository } from '../repositories/TemplateRepository'

export function updateTemplateTermsOfAccess(
  templateRepository: TemplateRepository,
  templateId: number,
  termsOfAccess: TermsOfAccess
): Promise<void> {
  return templateRepository.updateTemplateTermsOfAccess(templateId, termsOfAccess)
}

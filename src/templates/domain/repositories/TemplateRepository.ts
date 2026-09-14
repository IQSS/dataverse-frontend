import { Template } from '@/templates/domain/models/Template'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import { UpdateTemplateLicenseTermsInfo } from '@/templates/domain/models/UpdateTemplateLicenseTermsInfo'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'

export interface TemplateRepository {
  createTemplate: (template: TemplateInfo, collectionIdOrAlias: number | string) => Promise<void>
  getTemplate: (templateId: number) => Promise<Template>
  getTemplatesByCollectionId: (collectionIdOrAlias: number | string) => Promise<Template[]>
  deleteTemplate: (templateId: number) => Promise<void>
  setTemplateAsDefault: (templateId: number, collectionIdOrAlias: number | string) => Promise<void>
  unsetTemplateAsDefault: (collectionIdOrAlias: number | string) => Promise<void>
  updateTemplateMetadata: (
    templateId: number,
    payload: UpdateTemplateMetadataInfo,
    replace?: boolean
  ) => Promise<void>
  updateTemplateLicenseTerms: (
    templateId: number,
    payload: UpdateTemplateLicenseTermsInfo
  ) => Promise<void>
  updateTemplateTermsOfAccess: (templateId: number, termsOfAccess: TermsOfAccess) => Promise<void>
}

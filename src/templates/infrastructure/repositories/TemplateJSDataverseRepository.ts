import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplatesByCollectionId,
  setTemplateAsDefault,
  unsetTemplateAsDefault,
  updateTemplateMetadata,
  updateTemplateLicenseTerms,
  updateTemplateTermsOfAccess
} from '@iqss/dataverse-client-javascript'
import { Template } from '@/templates/domain/models/Template'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import { UpdateTemplateLicenseTermsInfo } from '@/templates/domain/models/UpdateTemplateLicenseTermsInfo'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'

export class TemplateJSDataverseRepository implements TemplateRepository {
  createTemplate(template: TemplateInfo, collectionIdOrAlias: number | string): Promise<void> {
    return createTemplate.execute(
      template as Parameters<typeof createTemplate.execute>[0],
      collectionIdOrAlias
    )
  }

  getTemplate(templateId: number): Promise<Template> {
    return getTemplate.execute(templateId)
  }

  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]> {
    return getTemplatesByCollectionId.execute(collectionIdOrAlias)
  }

  deleteTemplate(templateId: number): Promise<void> {
    return deleteTemplate.execute(templateId)
  }

  setTemplateAsDefault(templateId: number, collectionIdOrAlias: number | string): Promise<void> {
    return setTemplateAsDefault.execute(templateId, collectionIdOrAlias)
  }

  unsetTemplateAsDefault(collectionIdOrAlias: number | string): Promise<void> {
    return unsetTemplateAsDefault.execute(collectionIdOrAlias)
  }

  updateTemplateMetadata(
    templateId: number,
    payload: UpdateTemplateMetadataInfo,
    replace = true
  ): Promise<void> {
    return updateTemplateMetadata.execute(
      templateId,
      payload as Parameters<typeof updateTemplateMetadata.execute>[1],
      replace
    )
  }

  updateTemplateLicenseTerms(
    templateId: number,
    payload: UpdateTemplateLicenseTermsInfo
  ): Promise<void> {
    return updateTemplateLicenseTerms.execute(templateId, payload)
  }

  updateTemplateTermsOfAccess(templateId: number, termsOfAccess: TermsOfAccess): Promise<void> {
    return updateTemplateTermsOfAccess.execute(templateId, termsOfAccess)
  }
}

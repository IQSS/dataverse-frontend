import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { UpdateTemplateLicenseTermsInfo } from '@/templates/domain/models/UpdateTemplateLicenseTermsInfo'
import { updateTemplateLicenseTerms as updateTemplateLicenseTermsUseCase } from '@/templates/domain/useCases/updateTemplateLicenseTerms'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface Options {
  templateRepository: TemplateRepository
  onSuccess: () => void
}

interface ReturnType {
  isLoading: boolean
  error: string | null
  handleUpdateLicenseTerms: (
    templateId: number,
    payload: UpdateTemplateLicenseTermsInfo
  ) => Promise<boolean>
}

export const useUpdateTemplateLicenseTerms = ({
  templateRepository,
  onSuccess
}: Options): ReturnType => {
  const { t } = useTranslation('datasetTemplates')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateLicenseTerms = async (
    templateId: number,
    payload: UpdateTemplateLicenseTermsInfo
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await updateTemplateLicenseTermsUseCase(templateRepository, templateId, payload)
      onSuccess()
      return true
    } catch (err) {
      console.error('useUpdateTemplateLicenseTerms error:', err)
      if (err instanceof WriteError) {
        const handler = new JSDataverseWriteErrorHandler(err)
        setError(handler.getReasonWithoutStatusCode() ?? handler.getErrorMessage())
      } else if (err instanceof Error && err.message) {
        setError(err.message)
      } else {
        setError(t('editTemplate.errors.saveLicenseFailed'))
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, handleUpdateLicenseTerms }
}

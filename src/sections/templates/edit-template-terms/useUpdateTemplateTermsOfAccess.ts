import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { updateTemplateTermsOfAccess as updateTemplateTermsOfAccessUseCase } from '@/templates/domain/useCases/updateTemplateTermsOfAccess'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface Options {
  templateRepository: TemplateRepository
  onSuccess: () => void
}

interface ReturnType {
  isLoading: boolean
  error: string | null
  handleUpdateTermsOfAccess: (templateId: number, termsOfAccess: TermsOfAccess) => Promise<boolean>
}

export const useUpdateTemplateTermsOfAccess = ({
  templateRepository,
  onSuccess
}: Options): ReturnType => {
  const { t } = useTranslation('datasetTemplates')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateTermsOfAccess = async (
    templateId: number,
    termsOfAccess: TermsOfAccess
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await updateTemplateTermsOfAccessUseCase(templateRepository, templateId, termsOfAccess)
      onSuccess()
      return true
    } catch (err) {
      console.error('useUpdateTemplateTermsOfAccess error:', err)
      if (err instanceof WriteError) {
        const handler = new JSDataverseWriteErrorHandler(err)
        setError(handler.getReasonWithoutStatusCode() ?? handler.getErrorMessage())
      } else if (err instanceof Error && err.message) {
        setError(err.message)
      } else {
        setError(t('editTemplate.errors.saveTermsOfAccessFailed'))
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, handleUpdateTermsOfAccess }
}

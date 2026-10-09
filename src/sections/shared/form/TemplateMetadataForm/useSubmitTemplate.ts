import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { createTemplate as createTemplateUseCase } from '@/templates/domain/useCases/createTemplate'
import { updateTemplateMetadata as updateTemplateMetadataUseCase } from '@/templates/domain/useCases/updateTemplateMetadata'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type CreateOptions = {
  mode: 'create'
  templateRepository: TemplateRepository
  collectionId: string
}

type EditOptions = {
  mode: 'edit'
  templateRepository: TemplateRepository
  templateId: number
}

type UseSubmitTemplateOptions = CreateOptions | EditOptions

interface UseSubmitTemplateReturn {
  submissionStatus: SubmissionStatus
  submitTemplate: (payload: TemplateInfo | UpdateTemplateMetadataInfo) => Promise<boolean>
  submitError: string | null
}

export function useSubmitTemplate(options: UseSubmitTemplateOptions): UseSubmitTemplateReturn {
  const { t } = useTranslation('datasetTemplates')
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitTemplate = async (
    payload: TemplateInfo | UpdateTemplateMetadataInfo
  ): Promise<boolean> => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)
    setSubmitError(null)

    try {
      if (options.mode === 'create') {
        await createTemplateUseCase(
          options.templateRepository,
          payload as TemplateInfo,
          options.collectionId
        )
      } else {
        await updateTemplateMetadataUseCase(
          options.templateRepository,
          options.templateId,
          payload as UpdateTemplateMetadataInfo
        )
      }
      setSubmissionStatus(SubmissionStatus.SubmitComplete)
      return true
    } catch (error) {
      console.error('useSubmitTemplate error:', error)
      if (error instanceof WriteError) {
        const handler = new JSDataverseWriteErrorHandler(error)
        const formattedError =
          handler.getReasonWithoutStatusCode() ??
          /* istanbul ignore next */ handler.getErrorMessage()
        setSubmitError(formattedError)
      } else if (error instanceof Error && error.message) {
        setSubmitError(error.message)
      } else {
        setSubmitError(
          options.mode === 'create'
            ? t('createTemplate.errors.saveFailed')
            : t('editTemplate.errors.saveMetadataFailed')
        )
      }
      setSubmissionStatus(SubmissionStatus.Errored)
      return false
    }
  }

  return {
    submissionStatus,
    submitTemplate,
    submitError
  }
}

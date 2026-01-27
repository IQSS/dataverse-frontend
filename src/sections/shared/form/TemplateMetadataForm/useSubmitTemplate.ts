import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError, createTemplate } from '@iqss/dataverse-client-javascript'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitTemplateReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitTemplate: (payload: TemplateInfo) => Promise<boolean>
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitTemplate: (payload: TemplateInfo) => Promise<boolean>
      submitError: string
    }

export function useSubmitTemplate(collectionId: string): UseSubmitTemplateReturnType {
  const { t } = useTranslation('datasetTemplates', { keyPrefix: 'createTemplate' })
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitTemplate = async (template: TemplateInfo): Promise<boolean> => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)
    setSubmitError(null)

    try {
      await createTemplate.execute(
        template as Parameters<typeof createTemplate.execute>[0],
        collectionId
      )
      setSubmissionStatus(SubmissionStatus.SubmitComplete)
      return true
    } catch (error) {
      if (error instanceof WriteError) {
        const handler = new JSDataverseWriteErrorHandler(error)
        const formattedError =
          handler.getReasonWithoutStatusCode() ??
          /* istanbul ignore next */ handler.getErrorMessage()
        setSubmitError(formattedError)
      } else {
        setSubmitError(t('errors.saveFailed'))
      }
      setSubmissionStatus(SubmissionStatus.Errored)
      return false
    }
  }

  return {
    submissionStatus,
    submitTemplate,
    submitError
  } as UseSubmitTemplateReturnType
}

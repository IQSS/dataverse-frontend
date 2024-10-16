import { useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { publishDataset } from '../../../dataset/domain/useCases/publishDataset'

import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'

type UsePublishDatasetReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitPublish: (versionUpdateType: VersionUpdateType) => void
      publishError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitPublish: (versionUpdateType: VersionUpdateType) => void
      publishError: string
    }

export function usePublishDataset(
  repository: DatasetRepository,
  persistentId: string,
  onPublishSucceed: () => void
): UsePublishDatasetReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [publishError, setPublishError] = useState<string | null>(null)

  const submitPublish = (versionUpdateType: VersionUpdateType): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    publishDataset(repository, persistentId, versionUpdateType)
      .then(() => {
        setPublishError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        onPublishSucceed()
        return
      })
      .catch((err) => {
        const errorMessage = err instanceof Error && err.message ? err.message : 'Unknown Error' // TODO: i18n

        setPublishError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)
      })
  }

  return {
    submissionStatus,
    submitPublish,
    publishError
  } as UsePublishDatasetReturnType
}

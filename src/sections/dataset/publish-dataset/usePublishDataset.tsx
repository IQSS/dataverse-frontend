import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { publishDataset } from '../../../dataset/domain/useCases/publishDataset'
import { Route } from '../../Route.enum'

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
  onPublishErrorCallback: () => void
): UsePublishDatasetReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [publishError, setPublishError] = useState<string | null>(null)

  const navigate = useNavigate()

  const submitPublish = (versionUpdateType: VersionUpdateType): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    publishDataset(repository, persistentId, versionUpdateType)
      .then(() => {
        setPublishError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        navigate(`${Route.DATASETS}?persistentId=${persistentId}&Version=DRAFT`, {
          state: { publishInProgress: true }
        })
        return
      })
      .catch((err) => {
        console.log('caught error')
        const errorMessage = err instanceof Error && err.message ? err.message : 'Unknown Error' // TODO: i18n

        setPublishError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)

        onPublishErrorCallback()
      })
  }

  return {
    submissionStatus,
    submitPublish,
    publishError
  } as UsePublishDatasetReturnType
}

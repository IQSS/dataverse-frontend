import { useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { publishDataset } from '../../../dataset/domain/useCases/publishDataset'

import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { publishCollection } from '../../../collection/domain/useCases/publishCollection'

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
  collectionRepository: CollectionRepository,
  parentCollection: UpwardHierarchyNode,
  persistentId: string,
  onPublishSucceed: () => void
): UsePublishDatasetReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [publishError, setPublishError] = useState<string | null>(null)

  const submitPublish = (versionUpdateType: VersionUpdateType): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const publishDatasetAndHandleError = () => {
      publishDataset(repository, persistentId, versionUpdateType)
        .then(() => {
          setPublishError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          onPublishSucceed()
        })
        .catch((err) => {
          const errorMessage = err instanceof Error && err.message ? err.message : 'Unknown Error' // TODO: i18n
          setPublishError(errorMessage)
          setSubmissionStatus(SubmissionStatus.Errored)
        })
    }

    if (!parentCollection.isReleased) {
      publishCollection(collectionRepository, parentCollection.id)
        .then(publishDatasetAndHandleError)
        .catch((err) => {
          const errorMessage = err instanceof Error && err.message ? err.message : 'Unknown Error' // TODO: i18n
          setPublishError(errorMessage)
          setSubmissionStatus(SubmissionStatus.Errored)
        })
    } else {
      publishDatasetAndHandleError()
    }
  }

  return {
    submissionStatus,
    submitPublish,
    publishError
  } as UsePublishDatasetReturnType
}

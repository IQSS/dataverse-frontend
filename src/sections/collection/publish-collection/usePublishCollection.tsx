import { useState } from 'react'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { publishCollection } from '../../../collection/domain/useCases/publishCollection'

import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'

type UsePublishCollectionReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitPublish: () => void
      publishError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitPublish: () => void
      publishError: string
    }

export function usePublishCollection(
  repository: CollectionRepository,
  collectionId: string,
  onPublishSucceed: () => void
): UsePublishCollectionReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [publishError, setPublishError] = useState<string | null>(null)

  const submitPublish = (): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    publishCollection(repository, collectionId)
      .then(() => {
        setPublishError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        onPublishSucceed()
        return
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong while trying to publish the collection. Please try again later.'

        setPublishError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)
      })
  }

  return {
    submissionStatus,
    submitPublish,
    publishError
  } as UsePublishCollectionReturnType
}

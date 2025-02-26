import { useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { deaccessionDataset } from '../../../dataset/domain/useCases/deaccessionDataset'

import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { DeaccessionFormData } from '@/sections/dataset/deaccession-dataset/DeaccessionFormData'

type UseDeaccessionDatasetReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitDeaccession: (deaccessionFormData: DeaccessionFormData) => void
      deaccessionError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitDeaccession: (deaccessionFormData: DeaccessionFormData) => void
      deaccessionError: string
    }

export function useDeaccessionDataset(
  repository: DatasetRepository,
  persistentId: string,
  onPublishSucceed: () => void
): UseDeaccessionDatasetReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [deaccessionError, setDeaccessionError] = useState<string | null>(null)

  const submitDeaccession = (deaccessionFormData: DeaccessionFormData): void => {
    // Run the async function without returning a promise
    void (async () => {
      setSubmissionStatus(SubmissionStatus.IsSubmitting)
      console.log('deaccessionFormData', deaccessionFormData)

      try {
        await Promise.all(
          deaccessionFormData.versions.map(async (version) => {
            const datasetDeaccessionDTO = {
              deaccessionReason:
                deaccessionFormData.deaccessionReason +
                (deaccessionFormData.deaccessionReasonOther
                  ? ` ${deaccessionFormData.deaccessionReasonOther}`
                  : ''),
              deaccesionForwardUrl: deaccessionFormData.deaccessionForwardUrl
            }

            console.log('calling deaccession', datasetDeaccessionDTO)
            await deaccessionDataset(repository, persistentId, version, datasetDeaccessionDTO)
          })
        )

        setDeaccessionError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        onPublishSucceed()
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong while trying to deaccession your dataset'
        setDeaccessionError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)
      }
    })()
  }

  return {
    submissionStatus,
    submitDeaccession,
    deaccessionError
  } as UseDeaccessionDatasetReturnType
}

import { useState } from 'react'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { EditFileMetadataFormData } from '@/sections/edit-file-metadata/EditFilesList'
import { editFileMetadata } from '@/files/domain/useCases/editFileMetadata'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitFileMetadataReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: EditFileMetadataFormData) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: EditFileMetadataFormData) => void
      submitError: string
    }

export const useSubmitFileMetadata = (
  fileRepository: FileRepository,
  onSubmitSucceed: () => void
) => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: EditFileMetadataFormData): void => {
    void (async () => {
      setSubmissionStatus(SubmissionStatus.IsSubmitting)
      try {
        for (const file of formData.files) {
          const fileMetadataDTO = {
            id: file.id,
            description: file.description,
            directoryLabel: file.fileDir,
            label: file.fileName
          }
          await editFileMetadata(fileRepository, file.id, fileMetadataDTO)
        }

        setSubmitError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        onSubmitSucceed()
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong while trying to deaccession your dataset'
        setSubmitError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)
      } finally {
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
      }
    })()
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitFileMetadataReturnType
}

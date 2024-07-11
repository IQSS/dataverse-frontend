import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { createCollection } from '../../../collection/domain/useCases/createCollection'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { CollectionDTO } from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionFormData } from '.'
import { Route } from '../../Route.enum'
import { JSDataverseWriteErrorHandler } from '../../../shared/helpers/JSDataverseWriteErrorHandler'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitCollectionReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: CollectionFormData) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: CollectionFormData) => void
      submitError: string
    }

export function useSubmitCollection(
  collectionRepository: CollectionRepository,
  onSubmitErrorCallback: () => void
): UseSubmitCollectionReturnType {
  const navigate = useNavigate()

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: CollectionFormData): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const newCollection: CollectionDTO = {
      name: formData.name,
      alias: formData.alias,
      type: formData.type,
      contacts: formData.contacts.map((contact) => contact.value)
    }

    const hostCollection = formData.hostCollection

    createCollection(collectionRepository, newCollection, hostCollection)
      .then(() => {
        setSubmitError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)

        navigate(`${Route.COLLECTIONS}?id=${newCollection.alias}`, {
          state: { created: true }
        })
        return
      })
      .catch((err: WriteError) => {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError = error.getReasonWithoutStatusCode() ?? error.getErrorMessage()

        setSubmitError(formattedError)
        setSubmissionStatus(SubmissionStatus.Errored)

        onSubmitErrorCallback()
      })
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitCollectionReturnType
}

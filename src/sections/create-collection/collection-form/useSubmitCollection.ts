import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { createCollection } from '../../../collection/domain/useCases/createCollection'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { CollectionDTO } from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionFormData, CollectionFormValuesOnSubmit } from './CollectionForm'
import { RouteWithParams } from '../../Route.enum'
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
  ownerCollectionId: string,
  onSubmitErrorCallback: () => void
): UseSubmitCollectionReturnType {
  const navigate = useNavigate()

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: CollectionFormValuesOnSubmit): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const newCollection: CollectionDTO = {
      name: formData.name,
      alias: formData.alias,
      type: formData.type,
      contacts: formData.contacts.map((contact) => contact.value)
    }

    // TODO: We can't send the hostCollection name, but we should send the hostCollection alias
    // So in a next iteration we should get the hostCollection alias from the hostCollection name selected

    createCollection(collectionRepository, newCollection, ownerCollectionId)
      .then(() => {
        setSubmitError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)

        navigate(RouteWithParams.COLLECTIONS(newCollection.alias), {
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

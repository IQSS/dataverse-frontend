import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItemsFormData } from '../types'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitFeaturedItemsReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: FeaturedItemsFormData) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: FeaturedItemsFormData) => void
      submitError: string
    }

export function useSubmitFeaturedItems(
  collectionId: string,
  collectionRepository: CollectionRepository,
  onSubmitErrorCallback: () => void
): UseSubmitFeaturedItemsReturnType {
  const navigate = useNavigate()

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: FeaturedItemsFormData): void => {
    // setSubmissionStatus(SubmissionStatus.IsSubmitting)

    console.log(formData)

    // const newOrUpdatedCollection: CollectionDTO = {
    //   name: formData.name,
    //   alias: formData.alias,
    //   type: formData.type,
    //   affiliation: formData.affiliation,
    //   description: formData.description,
    //   contacts: contactsDTO,
    //   metadataBlockNames: shouldSendMetadataBlockNamesAndInputLevels
    //     ? metadataBlockNamesDTO
    //     : undefined,
    //   inputLevels: shouldSendMetadataBlockNamesAndInputLevels ? inputLevelsDTO : undefined,
    //   facetIds: shouldSendFacetIds ? facetIdsDTO : undefined
    // }

    //   editCollection(collectionRepository, newOrUpdatedCollection, collectionIdOrParentCollectionId)
    //     .then(() => {
    //       setSubmitError(null)
    //       setSubmissionStatus(SubmissionStatus.SubmitComplete)

    //       navigate(RouteWithParams.COLLECTIONS(newOrUpdatedCollection.alias), {
    //         state: { edited: true }
    //       })
    //       return
    //     })
    //     .catch((err: WriteError) => {
    //       const error = new JSDataverseWriteErrorHandler(err)
    //       const formattedError = error.getReasonWithoutStatusCode() ?? error.getErrorMessage()
    //       setSubmitError(formattedError)
    //       setSubmissionStatus(SubmissionStatus.Errored)
    //       onSubmitErrorCallback()
    //     })
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitFeaturedItemsReturnType
}

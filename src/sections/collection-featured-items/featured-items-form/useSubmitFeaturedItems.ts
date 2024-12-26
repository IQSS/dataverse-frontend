import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItemsFormHelper } from './FeaturedItemsFormHelper'
import { updateCollectionFeaturedItems } from '@/collection/domain/useCases/updateCollectionFeaturedItems'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { RouteWithParams } from '@/sections/Route.enum'
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

  const submitForm = (formCollectedData: FeaturedItemsFormData): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const _formData = new FormData()

    const itemsDTO = FeaturedItemsFormHelper.defineFeaturedItemsDTO(formCollectedData.featuredItems)

    // TODO: Send form data from SPA or trough JS Dataverse and from here send this itemsDTO only 👆

    console.log({ itemsDTO })

    // itemsDTO.forEach((item) => {
    //   if (item.id) {
    //     formData.append(`items[${item.order}][id]`, item.id)
    //   }
    //   formData.append(`items[${item.order}][order]`, JSON.stringify(item.order))
    //   formData.append(`items[${item.order}][content]`, item.content)
    //   formData.append(`items[${item.order}][keepFile]`, JSON.stringify(item.keepFile))

    //   if (item.file) {
    //     formData.append(`items[${item.order}][file]`, item.file)
    //   }
    // })

    updateCollectionFeaturedItems(collectionRepository, itemsDTO, collectionId)
      .then(() => {
        setSubmitError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)

        // TODO:ME Use toastify to easy show success message instead of using static alerts

        navigate(RouteWithParams.COLLECTIONS(collectionId))
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
  } as UseSubmitFeaturedItemsReturnType
}

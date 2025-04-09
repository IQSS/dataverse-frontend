import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WriteError } from '@iqss/dataverse-client-javascript'
import {
  CollectionFormData,
  CollectionFormDirtyFields,
  CollectionFormValuesOnSubmit
} from '../types'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import {
  EditCreateCollectionFormMode,
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FACETS_FROM_PARENT,
  USE_FIELDS_FROM_PARENT
} from '../EditCreateCollectionForm'
import { CollectionDTO } from '@/collection/domain/useCases/DTOs/CollectionDTO'
import { createCollection } from '@/collection/domain/useCases/createCollection'
import { editCollection } from '@/collection/domain/useCases/editCollection'
import { RouteWithParams } from '@/sections/Route.enum'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { CollectionFormHelper } from '../CollectionFormHelper'

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
  mode: EditCreateCollectionFormMode,
  collectionIdOrParentCollectionId: string,
  collectionRepository: CollectionRepository,
  onSubmitErrorCallback: () => void,
  dirtyFields: CollectionFormDirtyFields
): UseSubmitCollectionReturnType {
  const navigate = useNavigate()

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: CollectionFormValuesOnSubmit): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const contactsDTO = formData.contacts.map((contact) => contact.value)

    const metadataBlockNamesDTO =
      CollectionFormHelper.formatFormMetadataBlockNamesToMetadataBlockNamesDTO(
        formData[METADATA_BLOCKS_NAMES_GROUPER]
      )

    const changedInputLevelsValues = CollectionFormHelper.getModifiedInputLevelValuesOnly(
      dirtyFields.inputLevels,
      formData[INPUT_LEVELS_GROUPER]
    )

    const inputLevelsDTO = CollectionFormHelper.formatFormInputLevelsToInputLevelsDTO(
      metadataBlockNamesDTO,
      changedInputLevelsValues
    )

    const facetIdsDTO = formData.facetIds.map((facet) => facet.value)

    const useMetadataFieldsFromParentChecked = formData[USE_FIELDS_FROM_PARENT]

    const useFacetsFromParentChecked = formData[USE_FACETS_FROM_PARENT]

    const newOrUpdatedCollection: CollectionDTO = {
      name: formData.name,
      alias: formData.alias,
      type: formData.type,
      affiliation: formData.affiliation,
      description: formData.description,
      contacts: contactsDTO,
      metadataBlockNames: metadataBlockNamesDTO,
      inputLevels: inputLevelsDTO,
      facetIds: facetIdsDTO,
      inheritMetadataBlocksFromParent: useMetadataFieldsFromParentChecked,
      inheritFacetsFromParent: useFacetsFromParentChecked
    }

    if (mode === 'create') {
      createCollection(
        collectionRepository,
        newOrUpdatedCollection,
        collectionIdOrParentCollectionId
      )
        .then(() => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)

          navigate(RouteWithParams.COLLECTIONS(newOrUpdatedCollection.alias), {
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
    } else {
      editCollection(collectionRepository, newOrUpdatedCollection, collectionIdOrParentCollectionId)
        .then(() => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)

          navigate(RouteWithParams.COLLECTIONS(newOrUpdatedCollection.alias), {
            state: { edited: true }
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
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitCollectionReturnType
}

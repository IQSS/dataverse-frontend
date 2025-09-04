import { useEffect, useRef } from 'react'
import { type UseFormSetValue } from 'react-hook-form'
import { type User } from '@/users/domain/models/User'
import {
  type ComposedSingleFieldValue,
  type DatasetMetadataFormValues
} from '../MetadataFieldsHelper'
import { type DatasetMetadataFormMode } from '..'
import { DateHelper } from '@/shared/helpers/DateHelper'

interface UsePrefillFieldsWithUserDataProps {
  mode: DatasetMetadataFormMode
  user: User | null
  formDefaultValues: DatasetMetadataFormValues
  setValue: UseFormSetValue<DatasetMetadataFormValues>
}

/**
 * This hook is used to prefill specific fields with user data when in create mode.
 * It checks if the user is available and if the mode is 'create'.
 * It also ensures that it does not overwrite any existing values in the formDefaultValues that might come from a template.
 */

export const usePrefillFieldsWithUserData = ({
  mode,
  user,
  formDefaultValues,
  setValue
}: UsePrefillFieldsWithUserDataProps) => {
  const didPrefillRef = useRef(false)
  useEffect(() => {
    if (didPrefillRef.current) return
    if (mode !== 'create' || !user) return

    const displayName = `${user.lastName}, ${user.firstName}`

    const authorName0 = (formDefaultValues?.citation?.author as ComposedSingleFieldValue[])?.[0]
      .authorName
    const datasetContact0 = (
      formDefaultValues?.citation?.datasetContact as ComposedSingleFieldValue[]
    )?.[0].datasetContactName
    const datasetContactEmail0 = (
      formDefaultValues?.citation?.datasetContact as ComposedSingleFieldValue[]
    )?.[0].datasetContactEmail
    const depositor = formDefaultValues?.citation?.depositor as string
    const dateOfDeposit = formDefaultValues?.citation?.dateOfDeposit as string
    const datasetContactAffiliation = (
      formDefaultValues?.citation?.datasetContact as ComposedSingleFieldValue[]
    )?.[0].datasetContactAffiliation
    const authorAffiliation0 = (
      formDefaultValues?.citation?.author as ComposedSingleFieldValue[]
    )?.[0].authorAffiliation

    if (!datasetContact0 && !datasetContactEmail0) {
      setValue('citation.datasetContact.0.datasetContactName', displayName)
      setValue('citation.datasetContact.0.datasetContactEmail', user.email, {
        shouldValidate: true
      })
    }

    if (!depositor) {
      setValue('citation.depositor', displayName)
    }
    if (!dateOfDeposit) {
      setValue('citation.dateOfDeposit', DateHelper.toISO8601Format(new Date()))
    }

    if (!authorName0 && !authorAffiliation0) {
      setValue('citation.author.0.authorName', displayName)
    }

    if (user.affiliation) {
      if (!authorName0 && !datasetContactAffiliation && !authorAffiliation0) {
        setValue('citation.datasetContact.0.datasetContactAffiliation', user.affiliation)
        setValue('citation.author.0.authorAffiliation', user.affiliation)
      }
    }
    didPrefillRef.current = true
  }, [setValue, user, mode, formDefaultValues])
}

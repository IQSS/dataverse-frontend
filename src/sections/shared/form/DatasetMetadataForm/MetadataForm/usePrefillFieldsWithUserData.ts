import { useEffect, useRef } from 'react'
import { type UseFormSetValue } from 'react-hook-form'
import { type User } from '@/users/domain/models/User'
import { type DatasetMetadataFormValues } from '../MetadataFieldsHelper'
import { type DatasetMetadataFormMode } from '..'
import { getUserDataPrefillValues } from './userDataPrefill'

type SetFieldValue = (
  fieldName: string,
  value: string,
  options?: { shouldValidate: boolean }
) => void

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
 * Which fields get which values is decided by getUserDataPrefillValues.
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

    // The field paths are built at runtime (for example "citation.author.0.authorName"), which the
    // typed setValue cannot follow, so we call it through a plainly typed alias
    const setFieldValue = setValue as unknown as SetFieldValue

    getUserDataPrefillValues(formDefaultValues, user).forEach(
      ({ fieldName, value, shouldValidate }) => {
        setFieldValue(fieldName, value, shouldValidate ? { shouldValidate: true } : undefined)
      }
    )

    didPrefillRef.current = true
  }, [setValue, user, mode, formDefaultValues])
}

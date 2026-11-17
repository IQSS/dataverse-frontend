import { type User } from '@/users/domain/models/User'
import { DateHelper } from '@/shared/helpers/DateHelper'
import {
  type ComposedSingleFieldValue,
  type DatasetMetadataFormValues
} from '../MetadataFieldsHelper'

export interface UserDataPrefillValue {
  fieldName: string
  value: string
  shouldValidate?: boolean
}

/**
 * Works out which fields of a new dataset are filled in from the depositor's account, and with what.
 * It never overwrites a value that is already in the form default values (for example from a template).
 * Pure function: the prefill hook applies the result to the form, and the create layout uses it to know
 * which required fields start out completed and which values came from the account.
 */
export function getUserDataPrefillValues(
  formDefaultValues: DatasetMetadataFormValues,
  user: User
): UserDataPrefillValue[] {
  const displayName = `${user.lastName}, ${user.firstName}`
  const prefillValues: UserDataPrefillValue[] = []

  const citation = formDefaultValues?.citation
  const author0 = (citation?.author as ComposedSingleFieldValue[] | undefined)?.[0]
  const datasetContact0 = (citation?.datasetContact as ComposedSingleFieldValue[] | undefined)?.[0]

  const authorName0 = author0?.authorName
  const authorAffiliation0 = author0?.authorAffiliation
  const datasetContactName0 = datasetContact0?.datasetContactName
  const datasetContactEmail0 = datasetContact0?.datasetContactEmail
  const datasetContactAffiliation0 = datasetContact0?.datasetContactAffiliation
  const depositor = citation?.depositor as string | undefined
  const dateOfDeposit = citation?.dateOfDeposit as string | undefined

  if (!datasetContactName0 && !datasetContactEmail0) {
    prefillValues.push({
      fieldName: 'citation.datasetContact.0.datasetContactName',
      value: displayName
    })
    prefillValues.push({
      fieldName: 'citation.datasetContact.0.datasetContactEmail',
      value: user.email,
      shouldValidate: true
    })
  }

  if (!depositor) {
    prefillValues.push({ fieldName: 'citation.depositor', value: displayName })
  }

  if (!dateOfDeposit) {
    prefillValues.push({
      fieldName: 'citation.dateOfDeposit',
      value: DateHelper.toISO8601Format(new Date())
    })
  }

  if (!authorName0 && !authorAffiliation0) {
    prefillValues.push({ fieldName: 'citation.author.0.authorName', value: displayName })
  }

  if (user.affiliation && !authorName0 && !datasetContactAffiliation0 && !authorAffiliation0) {
    prefillValues.push({
      fieldName: 'citation.datasetContact.0.datasetContactAffiliation',
      value: user.affiliation
    })
    prefillValues.push({
      fieldName: 'citation.author.0.authorAffiliation',
      value: user.affiliation
    })
  }

  return prefillValues
}

/**
 * Returns a copy of the form values with the prefill values set at their paths (for example
 * "citation.author.0.authorName"). The original object is left untouched.
 */
export function applyPrefillValues(
  formValues: DatasetMetadataFormValues,
  prefillValues: UserDataPrefillValue[]
): DatasetMetadataFormValues {
  return prefillValues.reduce(
    (values, { fieldName, value }) => setValueAtPath(values, fieldName.split('.'), value),
    formValues
  )
}

function setValueAtPath<T>(target: T, path: string[], value: string): T {
  if (path.length === 0) return value as unknown as T

  const [head, ...rest] = path

  if (Array.isArray(target)) {
    const index = Number(head)
    const copy = [...(target as unknown[])]
    copy[index] = setValueAtPath(copy[index], rest, value)
    return copy as unknown as T
  }

  const record = (target ?? {}) as Record<string, unknown>
  return { ...record, [head]: setValueAtPath(record[head], rest, value) } as T
}

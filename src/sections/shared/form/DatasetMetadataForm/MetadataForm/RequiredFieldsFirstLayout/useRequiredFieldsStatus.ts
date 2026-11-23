import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { RequiredFieldsHelper, type RequiredFieldEntry } from './RequiredFieldsHelper'

export interface RequiredFieldsStatus {
  totalCount: number
  emptyCount: number
  allFilled: boolean
  nextEmptyControlName?: string
}

/**
 * Follows the form values of the required fields and reports how many are still empty, and which
 * control to go to in order to fill the next one.
 */
export const useRequiredFieldsStatus = (
  requiredFields: RequiredFieldEntry[]
): RequiredFieldsStatus => {
  const formNames = useMemo(
    () => requiredFields.map((entry) => RequiredFieldsHelper.getFormName(entry)),
    [requiredFields]
  )

  const values = useWatch({ name: formNames }) as unknown[]

  return useMemo(() => {
    const emptyEntries = requiredFields
      .map((entry, index) => ({ entry, value: values[index] }))
      .filter(({ entry, value }) => !RequiredFieldsHelper.isFilled(entry.field, value))

    const next = emptyEntries[0]

    return {
      totalCount: requiredFields.length,
      emptyCount: emptyEntries.length,
      allFilled: emptyEntries.length === 0,
      nextEmptyControlName: next
        ? RequiredFieldsHelper.getFirstEmptyControlName(next.entry, next.value)
        : undefined
    }
  }, [requiredFields, values])
}

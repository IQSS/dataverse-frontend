import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

interface Props {
  fieldsToWatch?: string[]
  builtFieldName: string
}

const useWatchFieldsThatTriggerRequired = ({ fieldsToWatch, builtFieldName }: Props): boolean => {
  const dependantFieldsValues = useWatch({
    name: fieldsToWatch || []
  })

  const { clearErrors } = useFormContext()

  const fieldShouldBecomeRequired = fieldsToWatch
    ? dependantFieldsValues.some((value) => value)
    : false

  useEffect(() => {
    if (!fieldShouldBecomeRequired) {
      clearErrors(builtFieldName)
    }
  }, [fieldShouldBecomeRequired, builtFieldName, clearErrors])

  return fieldShouldBecomeRequired
}

export default useWatchFieldsThatTriggerRequired

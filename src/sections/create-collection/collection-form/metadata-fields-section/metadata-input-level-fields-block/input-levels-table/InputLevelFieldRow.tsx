import { useId } from 'react'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { ReducedMetadataFieldInfo } from '../useGetBlockMetadataInputLevelFields'
import styles from './InputLevelsTable.module.scss'
//   interface CollectionInputLevel {
//     datasetFieldName: string
//     include: boolean
//     required: boolean
//   }

interface InputLevelFieldRowProps {
  metadataField: ReducedMetadataFieldInfo
}

export const InputLevelFieldRow = ({ metadataField }: InputLevelFieldRowProps) => {
  const checkboxID = useId()
  const { control } = useFormContext()
  const { name, displayName, childMetadataFields } = metadataField

  const rules: UseControllerProps['rules'] = {}

  return (
    <>
      <tr className={styles['input-level-row']}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <>
              <td>
                <Form.Group.Checkbox
                  id={checkboxID}
                  onChange={onChange}
                  name={name}
                  label={displayName}
                  checked={value as boolean}
                  isInvalid={invalid}
                  invalidFeedback={error?.message}
                  // disabled={isCitation ? true : useFieldsFromParentCheckedValue}
                  ref={ref}
                />
              </td>
              <td>
                {/* <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Form.Group.Checkbox 
          )}
        /> */}
              </td>
            </>
          )}
        />
      </tr>
      {childMetadataFields &&
        Object.entries(childMetadataFields).map(([fieldName, field]) => (
          <tr className={styles['input-level-row--child-field']} key={fieldName}>
            <td>{field.displayName}</td>
          </tr>
        ))}
    </>
  )
}

import { ChangeEvent, useId, useState } from 'react'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { ConfirmResetModificationsModal } from './ConfirmResetModificationsModal'
import { METADATA_BLOCKS_NAMES_GROUPER, USE_FIELDS_FROM_ROOT_NAME } from '../../CollectionForm'

const ALL_INPUT_LEVEL_FIELDS_EXCEPT_CITATION = [
  MetadataBlockName.GEOSPATIAL,
  MetadataBlockName.SOCIAL_SCIENCE,
  MetadataBlockName.ASTROPHYSICS,
  MetadataBlockName.BIOMEDICAL,
  MetadataBlockName.JOURNAL
]

export const FieldsFromRootCheckbox = () => {
  const checkboxID = useId()
  const { control, setValue } = useFormContext()
  const [showResetConfirmationModal, setShowResetConfirmationModal] = useState(false)

  const handleContinueWithReset = () => {
    setValue(USE_FIELDS_FROM_ROOT_NAME, true)

    ALL_INPUT_LEVEL_FIELDS_EXCEPT_CITATION.forEach((blockName) => {
      setValue(`${METADATA_BLOCKS_NAMES_GROUPER}.${blockName}`, false)
    })

    closeModal()
  }

  const openModal = () => setShowResetConfirmationModal(true)
  const closeModal = () => setShowResetConfirmationModal(false)

  const rules: UseControllerProps['rules'] = {}

  return (
    <>
      <Controller
        name={USE_FIELDS_FROM_ROOT_NAME}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            // Only if trying to check the checkbox, open the modal to confirm the reset
            if (e.target.checked) {
              openModal()
            } else {
              onChange(e)
            }
          }
          return (
            <Form.Group.Checkbox
              id={checkboxID}
              onChange={handleChange}
              name={USE_FIELDS_FROM_ROOT_NAME}
              label="Use metadata fields from Root"
              checked={value as boolean}
              isInvalid={invalid}
              invalidFeedback={error?.message}
              ref={ref}
            />
          )
        }}
      />

      <ConfirmResetModificationsModal
        showModal={showResetConfirmationModal}
        onContinue={handleContinueWithReset}
        onCancel={closeModal}
      />
    </>
  )
}

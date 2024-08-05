import { ChangeEvent, useId, useState } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { ConfirmResetModificationsModal } from './ConfirmResetModificationsModal'
import {
  CollectionFormData,
  CollectionFormMetadataBlocks,
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FIELDS_FROM_PARENT
} from '../../CollectionForm'

const ALL_INPUT_LEVEL_FIELDS = [
  MetadataBlockName.CITATION,
  MetadataBlockName.GEOSPATIAL,
  MetadataBlockName.SOCIAL_SCIENCE,
  MetadataBlockName.ASTROPHYSICS,
  MetadataBlockName.BIOMEDICAL,
  MetadataBlockName.JOURNAL
]

interface FieldsFromParentCheckboxProps {
  defaultValues: CollectionFormData
}

export const FieldsFromParentCheckbox = ({ defaultValues }: FieldsFromParentCheckboxProps) => {
  const checkboxID = useId()
  const { control, setValue } = useFormContext()
  const [showResetConfirmationModal, setShowResetConfirmationModal] = useState(false)
  const hostCollectionFieldValue = useWatch({ name: 'hostCollection' }) as string

  const handleContinueWithReset = () => {
    setValue(USE_FIELDS_FROM_PARENT, true)

    // Reset metadata block names checboxes to the inital value
    ALL_INPUT_LEVEL_FIELDS.forEach((blockName) => {
      const castedBlockName = blockName as keyof CollectionFormMetadataBlocks

      setValue(
        `${METADATA_BLOCKS_NAMES_GROUPER}.${blockName}`,
        defaultValues[METADATA_BLOCKS_NAMES_GROUPER][castedBlockName]
      )
    })

    // Reset input levels to the initial value
    setValue(INPUT_LEVELS_GROUPER, defaultValues[INPUT_LEVELS_GROUPER])

    closeModal()
  }

  const openModal = () => setShowResetConfirmationModal(true)
  const closeModal = () => setShowResetConfirmationModal(false)

  const rules: UseControllerProps['rules'] = {}

  return (
    <>
      <Controller
        name={USE_FIELDS_FROM_PARENT}
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
              name={USE_FIELDS_FROM_PARENT}
              label={`Use metadata fields from ${hostCollectionFieldValue}`}
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

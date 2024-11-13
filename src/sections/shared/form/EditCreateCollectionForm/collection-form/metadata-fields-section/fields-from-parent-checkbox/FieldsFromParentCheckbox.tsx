import { ChangeEvent, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { ConfirmResetModificationsModal } from './ConfirmResetModificationsModal'
import { CollectionFormData } from '../../../types'
import {
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FIELDS_FROM_PARENT
} from '../../../EditCreateCollectionForm'

interface FieldsFromParentCheckboxProps {
  defaultValues: CollectionFormData
}

export const FieldsFromParentCheckbox = ({ defaultValues }: FieldsFromParentCheckboxProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm' })
  const checkboxID = useId()
  const { control, setValue } = useFormContext()
  const [showResetConfirmationModal, setShowResetConfirmationModal] = useState(false)
  const hostCollectionFieldValue = useWatch({ name: 'hostCollection' }) as string

  const handleContinueWithReset = () => {
    setValue(USE_FIELDS_FROM_PARENT, true, { shouldDirty: true })

    const metadataBlockDefaultValues = Object.entries(defaultValues[METADATA_BLOCKS_NAMES_GROUPER])

    // Reset metadata block names checboxes to the inital value
    metadataBlockDefaultValues.forEach(([blockName, blockInitialValue]) => {
      setValue(`${METADATA_BLOCKS_NAMES_GROUPER}.${blockName}`, blockInitialValue, {
        shouldDirty: true
      })
    })

    // Reset input levels to the initial value
    setValue(INPUT_LEVELS_GROUPER, defaultValues[INPUT_LEVELS_GROUPER], { shouldDirty: true })

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
              label={`${t(
                'fields.metadataFields.useMetadataFieldsFrom'
              )} ${hostCollectionFieldValue}`}
              checked={value as boolean}
              isInvalid={invalid}
              invalidFeedback={error?.message}
              data-testid="use-fields-from-parent-checkbox"
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

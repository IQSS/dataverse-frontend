import { ChangeEvent, useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Button, Form, Stack, CloseButton } from '@iqss/dataverse-design-system'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FIELDS_FROM_PARENT
} from '../../../EditCreateCollectionForm'
import { InputLevelsTable } from './input-levels-table/InputLevelsTable'
import { CollectionFormData } from '../../../types'

interface MetadataInputLevelFieldsBlockProps {
  blockName: MetadataBlockName
  blockDisplayName: string
  metadataBlockInfo: MetadataBlockInfo
  isEditingRootCollection: boolean
  defaultValues: CollectionFormData
}

export const MetadataInputLevelFieldsBlock = ({
  blockName,
  blockDisplayName,
  metadataBlockInfo,
  isEditingRootCollection,
  defaultValues
}: MetadataInputLevelFieldsBlockProps) => {
  const checkboxID = useId()
  const { control, setValue } = useFormContext()
  const { t } = useTranslation('shared', {
    keyPrefix: 'collectionForm.fields.metadataFields.inputLevelsTable'
  })

  const [inputLevelsTableStatus, setInputLevelsTableStatus] = useState({
    show: false,
    asDisabled: false
  })

  const metadataBlockFieldName = `${METADATA_BLOCKS_NAMES_GROUPER}.${blockName}`

  const useFieldsFromParentCheckedValue = useWatch({
    name: USE_FIELDS_FROM_PARENT
  }) as boolean
  const metadataBlockCheckedValue = useWatch({
    name: metadataBlockFieldName
  }) as boolean

  const isCitation = blockName === MetadataBlockName.CITATION

  const disabledBlockCheckbox = isCitation
    ? true
    : isEditingRootCollection
    ? false
    : useFieldsFromParentCheckedValue

  const rules: UseControllerProps['rules'] = {}

  const handleEditInputLevels = () => {
    setInputLevelsTableStatus({
      show: true,
      asDisabled: false
    })
  }

  const handleShowInputLevels = () => {
    setInputLevelsTableStatus({
      show: true,
      asDisabled: true
    })
  }

  const handleHideInputLevelsTable = () => {
    setInputLevelsTableStatus({
      show: false,
      asDisabled: false
    })
  }

  const handleIncludeBlockChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    // If input levels table is open, change the disabled status according to the block checked status
    if (inputLevelsTableStatus.show) {
      setInputLevelsTableStatus((currentStatus) => ({
        ...currentStatus,
        asDisabled: !e.target.checked
      }))
    }

    formOnChange(e)

    // Apart from changing the checked status of the blockname, if the block is unchecked, make the input levels of that block back to the initial default value
    if (!e.target.checked) {
      const blockInputLevelsToSetBackToDefault = Object.entries(
        defaultValues[INPUT_LEVELS_GROUPER]
      ).filter(([_key, value]) => value.parentBlockName === blockName)

      blockInputLevelsToSetBackToDefault.forEach(([key, _value]) => {
        setValue(`${INPUT_LEVELS_GROUPER}.${key}`, defaultValues[INPUT_LEVELS_GROUPER][key], {
          shouldDirty: true
        })
      })
    }
  }

  // In order to close the table when use fields from parent change from unchecked to checked
  useEffect(() => {
    if (useFieldsFromParentCheckedValue) {
      setInputLevelsTableStatus({
        show: false,
        asDisabled: false
      })
    }
  }, [useFieldsFromParentCheckedValue])

  return (
    <Stack direction="vertical" gap={2}>
      <Stack direction="horizontal" gap={1}>
        <Controller
          name={metadataBlockFieldName}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Form.Group.Checkbox
              id={checkboxID}
              onChange={(e) => handleIncludeBlockChange(e, onChange)}
              name={metadataBlockFieldName}
              label={isCitation ? `${blockDisplayName} (Required)` : blockDisplayName}
              checked={value as boolean}
              isInvalid={invalid}
              invalidFeedback={error?.message}
              disabled={disabledBlockCheckbox}
              ref={ref}
            />
          )}
        />

        {/* If checked and use fields from parent not checked */}
        {!inputLevelsTableStatus.show &&
          metadataBlockCheckedValue &&
          !useFieldsFromParentCheckedValue && (
            <Button variant="link" size="sm" type="button" onClick={handleEditInputLevels}>
              [+] View fields + set as hidden, required, or optional
            </Button>
          )}

        {/* If checked and use fields from parent checked */}
        {!inputLevelsTableStatus.show &&
          metadataBlockCheckedValue &&
          useFieldsFromParentCheckedValue && (
            <Button variant="link" size="sm" type="button" onClick={handleShowInputLevels}>
              [+] View fields
            </Button>
          )}
        {/* If just not checked */}
        {!inputLevelsTableStatus.show && !metadataBlockCheckedValue && (
          <Button variant="link" size="sm" type="button" onClick={handleShowInputLevels}>
            [+] View fields
          </Button>
        )}
      </Stack>

      <InputLevelsTable
        show={inputLevelsTableStatus.show}
        disabled={inputLevelsTableStatus.asDisabled}
        blockMetadataInputLevelFields={metadataBlockInfo}
        closeButton={
          <CloseButton
            onClick={handleHideInputLevelsTable}
            aria-label={t('hideTableAriaLabel')}
            tabIndex={inputLevelsTableStatus.show ? 0 : -1}
          />
        }
      />
    </Stack>
  )
}

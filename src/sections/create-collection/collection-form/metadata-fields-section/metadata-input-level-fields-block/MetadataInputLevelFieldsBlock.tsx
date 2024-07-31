import { useEffect, useId, useState } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Button, Form, Stack } from '@iqss/dataverse-design-system'
import { CloseButton } from 'react-bootstrap'
import { MetadataBlockName } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { ReducedMetadataBlockInfo } from '../../../useGetAllMetadataBlocksInfoByName'
import { METADATA_BLOCKS_NAMES_GROUPER, USE_FIELDS_FROM_PARENT } from '../../CollectionForm'
import { InputLevelsTable } from './input-levels-table/InputLevelsTable'

interface MetadataInputLevelFieldsBlockProps {
  blockName: MetadataBlockName
  blockDisplayName: string
  reducedMetadataBlockInfo: ReducedMetadataBlockInfo
}

export const MetadataInputLevelFieldsBlock = ({
  blockName,
  blockDisplayName,
  reducedMetadataBlockInfo
}: MetadataInputLevelFieldsBlockProps) => {
  const checkboxID = useId()
  const { control } = useFormContext()
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
              onChange={onChange}
              name={metadataBlockFieldName}
              label={blockDisplayName}
              checked={value as boolean}
              isInvalid={invalid}
              invalidFeedback={error?.message}
              disabled={isCitation ? true : useFieldsFromParentCheckedValue}
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
              [+] View Fields
            </Button>
          )}
        {/* If just not checked */}
        {!inputLevelsTableStatus.show && !metadataBlockCheckedValue && (
          <Button variant="link" size="sm" type="button" onClick={handleShowInputLevels}>
            [+] View Fields
          </Button>
        )}
      </Stack>

      <InputLevelsTable
        show={inputLevelsTableStatus.show}
        disabled={inputLevelsTableStatus.asDisabled}
        blockMetadataInputLevelFields={reducedMetadataBlockInfo}
        closeButton={
          <CloseButton
            onClick={handleHideInputLevelsTable}
            aria-label="Hide input levels table"
            tabIndex={inputLevelsTableStatus.show ? 0 : -1}
          />
        }
      />
    </Stack>
  )
}

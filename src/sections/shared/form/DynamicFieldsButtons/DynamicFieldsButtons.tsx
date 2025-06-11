import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Stack, Tooltip } from '@iqss/dataverse-design-system'
import { Dash, Plus } from 'react-bootstrap-icons'

interface DynamicFieldsButtonsProps {
  fieldName: string
  originalField?: boolean
  onAddButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
  onRemoveButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
  hideAddButton?: boolean
}

export const DynamicFieldsButtons = ({
  fieldName,
  originalField,
  onAddButtonClick,
  onRemoveButtonClick,
  hideAddButton
}: DynamicFieldsButtonsProps) => {
  const { t } = useTranslation('shared')

  return (
    <Stack direction="horizontal" gap={3}>
      {!hideAddButton && (
        <Tooltip placement="top" overlay={t('add')}>
          <Button
            type="button"
            variant="secondary"
            onClick={onAddButtonClick}
            className="px-2"
            aria-label={`${t('add')} ${fieldName}`}>
            <Plus title={t('add')} size={24} />
          </Button>
        </Tooltip>
      )}

      {!originalField && (
        <Tooltip placement="top" overlay={t('remove')}>
          <Button
            type="button"
            variant="secondary"
            onClick={onRemoveButtonClick}
            className="px-2"
            aria-label={`${t('remove')} ${fieldName}`}>
            <Dash title={t('remove')} size={24} />
          </Button>
        </Tooltip>
      )}
    </Stack>
  )
}

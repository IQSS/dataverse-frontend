import { useTranslation } from 'react-i18next'
import { Button, Stack } from '@iqss/dataverse-design-system'

interface ActionButtonsProps {
  isSubmitting: boolean
  isDeletingFeaturedItems: boolean
  isFormDirty: boolean
  hasInitialFeaturedItems: boolean
  onClickDelete: () => void
  position: 'top' | 'bottom'
}

export const ActionButtons = ({
  isSubmitting,
  isDeletingFeaturedItems,
  isFormDirty,
  hasInitialFeaturedItems,
  onClickDelete,
  position
}: ActionButtonsProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('editCollectionFeaturedItems')

  return (
    <Stack direction="horizontal" gap={3}>
      {hasInitialFeaturedItems && position === 'bottom' && (
        <Button
          onClick={onClickDelete}
          type="button"
          variant="danger"
          disabled={isSubmitting || isDeletingFeaturedItems}>
          {t('deleteAll.action')}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting || !isFormDirty || isDeletingFeaturedItems}>
        {tShared('saveChanges')}
      </Button>
    </Stack>
  )
}

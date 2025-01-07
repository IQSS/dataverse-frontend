import { useTranslation } from 'react-i18next'
import { Button, Stack } from '@iqss/dataverse-design-system'

interface ActionButtonsProps {
  isSubmitting: boolean
  isFormDirty: boolean
  hasInitialFeaturedItems: boolean
  onDeleteAllFeaturedItems: () => void
}

export const ActionButtons = ({
  isSubmitting,
  isFormDirty,
  hasInitialFeaturedItems,
  onDeleteAllFeaturedItems
}: ActionButtonsProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('editCollectionFeaturedItems')

  return (
    <Stack direction="horizontal" gap={3}>
      {hasInitialFeaturedItems && (
        <Button
          onClick={onDeleteAllFeaturedItems}
          type="button"
          variant="danger"
          disabled={isSubmitting}>
          {t('deleteAll')}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting || !isFormDirty}>
        {tShared('saveChanges')}
      </Button>
    </Stack>
  )
}

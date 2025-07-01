import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ArrowLeft, ExclamationTriangle } from 'react-bootstrap-icons'
import { SwalModal } from '@/sections/shared/swal-modal/SwalModal'
import { useShowConfirmDialog } from './useShowConfirmDialog'
import styles from './FeaturedItemField.module.scss'

interface BackToTypeSelectionButtonProps {
  itemIndex: number
  backToTypeSelection: () => void
}

export const BackToTypeSelectionButton = memo(
  ({ itemIndex, backToTypeSelection }: BackToTypeSelectionButtonProps) => {
    const { t: tShared } = useTranslation('shared')
    const { t } = useTranslation('editFeaturedItems')
    const { clearErrors } = useFormContext()

    const shouldShowConfirmBackDialog = useShowConfirmDialog({ itemIndex })

    const requestGoBackConfirmation = async (): Promise<boolean> => {
      const result = await SwalModal.fire({
        showDenyButton: true,
        denyButtonText: tShared('cancel'),
        confirmButtonText: tShared('continue'),
        html: (
          <div className="d-flex align-items-center gap-2 text-warning py-2">
            <ExclamationTriangle size={20} />
            <span>{t('backToTypeSelectionButton.dialogText')}</span>
          </div>
        ),
        width: 450
      })

      return result.isConfirmed
    }

    const handleBack = async () => {
      if (shouldShowConfirmBackDialog) {
        const shouldGoBack = await requestGoBackConfirmation()

        if (!shouldGoBack) return
      }

      // Clear errors when going back in case there was any
      clearErrors([
        `featuredItems.${itemIndex}.dvObjectUrl`,
        `featuredItems.${itemIndex}.content`,
        `featuredItems.${itemIndex}.image`
      ])

      // Go back to type selection
      backToTypeSelection()
    }

    return (
      <>
        <Tooltip overlay={t('backToTypeSelectionButton.label')} placement="top">
          <Button
            onClick={handleBack}
            icon={<ArrowLeft size={16} />}
            className={styles['back-btn']}
            type="button"
            variant="secondary"
            size="sm"
            aria-label={t('backToTypeSelectionButton.label')}
            data-testid="back-to-type-selection-button"
          />
        </Tooltip>
      </>
    )
  }
)

BackToTypeSelectionButton.displayName = 'BackToTypeSelectionButton'

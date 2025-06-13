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
    const { t } = useTranslation('shared')
    const { clearErrors } = useFormContext()

    const shouldShowConfirmBackDialog = useShowConfirmDialog({ itemIndex })

    const requestGoBackConfirmation = async (): Promise<boolean> => {
      const result = await SwalModal.fire({
        showDenyButton: true,
        denyButtonText: t('cancel'),
        confirmButtonText: 'Discard changes',
        html: (
          <div className="d-flex align-items-center gap-2 text-warning py-2">
            <ExclamationTriangle size={20} />
            <span>If you go back, your changes will be discarded.</span>
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
        <Tooltip overlay="Back to featured item type selection" placement="top">
          <Button
            onClick={handleBack}
            icon={<ArrowLeft size={16} />}
            className={styles['back-btn']}
            type="button"
            variant="secondary"
            size="sm"
            aria-label="Go back to featured item type selection"
          />
        </Tooltip>
      </>
    )
  }
)

BackToTypeSelectionButton.displayName = 'BackToTypeSelectionButton'

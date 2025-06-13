import { memo } from 'react'
import { useWatch } from 'react-hook-form'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { ArrowLeft, ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './FeaturedItemField.module.scss'
import { SwalModal } from '@/sections/shared/swal-modal/SwalModal'
import { useTranslation } from 'react-i18next'

interface BackToTypeSelectionButtonProps {
  itemIndex: number
  backToTypeSelection: () => void
}

export const BackToTypeSelectionButton = memo(
  ({ itemIndex, backToTypeSelection }: BackToTypeSelectionButtonProps) => {
    const { t } = useTranslation('shared')

    // All of this logic is to determine if we should show a "Back" confirmation dialog when the user tries to go back
    const [dvObjectUrlValue, customContentValue, customImageValue] = useWatch({
      name: [
        `featuredItems.${itemIndex}.dvObjectUrl`,
        `featuredItems.${itemIndex}.content`,
        `featuredItems.${itemIndex}.image`
      ]
    }) as [string | undefined | null, string | undefined | null, File | undefined | null]

    const isDvObjectUrlEmpty = !dvObjectUrlValue || dvObjectUrlValue.trim() === ''

    const isCustomContentEmpty =
      customContentValue?.replace(/<p[^>]*>|<\/p>/g, '').trim() === '' ||
      customContentValue === '' ||
      customContentValue === undefined

    const isCustomImageEmpty = customImageValue === null || customImageValue === undefined

    const shouldShowConfirmBackDialog =
      !isDvObjectUrlEmpty || !isCustomContentEmpty || !isCustomImageEmpty

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

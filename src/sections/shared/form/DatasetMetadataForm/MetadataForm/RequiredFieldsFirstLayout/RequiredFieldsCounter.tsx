import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { type RequiredFieldEntry } from './RequiredFieldsHelper'
import { useRequiredFieldsStatus } from './useRequiredFieldsStatus'
import styles from './RequiredFieldsFirstLayout.module.scss'

interface RequiredFieldsCounterProps {
  requiredFields: RequiredFieldEntry[]
  onGoToField: (controlName: string) => void
}

/**
 * The small counter next to the Save button: how many required fields are still empty, with a link
 * that jumps to the next one.
 */
export const RequiredFieldsCounter = ({
  requiredFields,
  onGoToField
}: RequiredFieldsCounterProps) => {
  const { t } = useTranslation('shared', {
    keyPrefix: 'datasetMetadataForm.requiredFieldsFirst.counter'
  })
  const { emptyCount, allFilled, nextEmptyControlName } = useRequiredFieldsStatus(requiredFields)

  if (requiredFields.length === 0) return null

  return (
    <div
      className={cn(styles.counter, allFilled ? styles['counter-done'] : styles['counter-pending'])}
      role="status"
      data-testid="required-fields-counter">
      {allFilled ? (
        t('allFilled')
      ) : (
        <>
          <span>{t('stillEmpty', { count: emptyCount })}</span>
          <button
            type="button"
            className={styles['counter-link']}
            onClick={() => nextEmptyControlName && onGoToField(nextEmptyControlName)}>
            {t('goToNext')}
          </button>
        </>
      )}
    </div>
  )
}

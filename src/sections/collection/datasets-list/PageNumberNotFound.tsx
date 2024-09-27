import { Alert } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function PageNumberNotFound() {
  const { t } = useTranslation('shared', { keyPrefix: 'pageNumberNotFound' })

  return (
    <Alert variant="danger" customHeading={t('heading')} dismissible={false}>
      {t('message')}
    </Alert>
  )
}

import { Alert } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function PageNotFound() {
  const { t } = useTranslation('shared', { keyPrefix: 'pageNotFound' })

  return (
    <Alert variant="danger" customHeading={t('heading')} dismissible={false}>
      {t('message')}
    </Alert>
  )
}

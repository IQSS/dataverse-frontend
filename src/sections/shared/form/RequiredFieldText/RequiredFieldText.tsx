import { RequiredInputSymbol } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function RequiredFieldText() {
  const { t } = useTranslation('datasetMetadataForm')
  return (
    <p className="m-0">
      <RequiredInputSymbol />
      {t('requiredFields')}
    </p>
  )
}

import { Form, RequiredInputSymbol } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function RequiredFieldText() {
  const { t } = useTranslation('shared')

  return (
    <Form.Group.Text>
      <RequiredInputSymbol />
      {t('asterisksIndicateRequiredFields')}
    </Form.Group.Text>
  )
}

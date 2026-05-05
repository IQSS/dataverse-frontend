import { Form, RequiredInputSymbol } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface RequiredFieldTextProps {
  i18nKey?: string
}

export function RequiredFieldText({
  i18nKey = 'asterisksIndicateRequiredFields'
}: RequiredFieldTextProps) {
  const { t } = useTranslation('shared')

  return (
    <Form.Group.Text>
      <RequiredInputSymbol />
      {t(i18nKey)}
    </Form.Group.Text>
  )
}

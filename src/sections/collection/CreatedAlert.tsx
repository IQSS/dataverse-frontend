import { Alert } from '@iqss/dataverse-design-system'
import { Trans, useTranslation } from 'react-i18next'

export const CreatedAlert = () => {
  const { t } = useTranslation('collection')
  return (
    <Alert variant="success" dismissible={false}>
      <Trans
        t={t}
        i18nKey="createdAlert"
        components={{
          anchor: (
            <a
              href="https://guides.dataverse.org/en/latest/user/dataverse-management.html"
              target="_blank"
              rel="noreferrer"
            />
          )
        }}
      />
    </Alert>
  )
}

import { Row, Col } from '@iqss/dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { Trans, useTranslation } from 'react-i18next'

interface LicenseProps {
  license: LicenseModel
  includeHelpText?: boolean
}

export function License({ license, includeHelpText = false }: LicenseProps) {
  const { t } = useTranslation('dataset')

  return (
    <Row>
      <Col sm={3}>
        <b>{t('license.title')}</b>
      </Col>
      <Col>
        {includeHelpText && (
          <div style={{ margin: '10px 0' }}>
            <Trans
              t={t}
              i18nKey="termsTab.licenseHelpText"
              components={{
                anchor: (
                  <a
                    href="https://dataverse.org/best-practices/dataverse-community-norms"
                    target="_blank"
                    rel="noreferrer"
                  />
                )
              }}
            />
          </div>
        )}
        {license.iconUri && (
          <img
            alt={t(`license.altTextPrefix`) + license.name}
            src={license.iconUri}
            title={license.name}
            style={{ marginRight: '0.5rem' }}
          />
        )}
        <a target="_blank" rel="noreferrer" href={license.uri}>
          {license.name}
        </a>
      </Col>
    </Row>
  )
}

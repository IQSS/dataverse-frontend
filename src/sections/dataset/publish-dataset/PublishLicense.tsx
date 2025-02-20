import { Row, Col } from '@iqss/dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface PublishLicenseProps {
  license?: LicenseModel
  handleCustomTermsClick: () => void
}

export function PublishLicense({ license, handleCustomTermsClick }: PublishLicenseProps) {
  const { t } = useTranslation('dataset')

  return (
    <Row>
      <Col sm={3}>
        <b>{t('license.title')}</b>
      </Col>
      <Col>
        {license && license.iconUri && (
          <img
            alt={t(`license.altTextPrefix`) + license.name}
            src={license.iconUri}
            title={license.name}
            style={{ marginRight: '0.5rem' }}
          />
        )}
        {license && (
          <a target="_blank" rel="noreferrer" href={license.uri}>
            {license.name}
          </a>
        )}
        {!license && (
          <span>
            <a href="#" onClick={handleCustomTermsClick}>
              {t('customTerms.title')}
            </a>{' '}
            - {t('customTerms.description')}
          </span>
        )}
      </Col>
    </Row>
  )
}

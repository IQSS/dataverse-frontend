import { Row, Col, Button } from '@iqss/dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface LicenseProps {
  license: LicenseModel | undefined
  onCustomTermsClick?: () => void
}

export function SummaryLicense({ license, onCustomTermsClick }: LicenseProps) {
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
        {license ? (
          <a target="_blank" rel="noreferrer" href={license.uri}>
            {license.name}
          </a>
        ) : (
          <Button variant="link" onClick={onCustomTermsClick}>
            {t('Custom Terms')}
          </Button>
        )}
      </Col>
    </Row>
  )
}

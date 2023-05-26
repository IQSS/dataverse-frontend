import { Row, Col } from 'dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface LicenseProps {
  license: LicenseModel
}

export function License({ license }: LicenseProps) {
  const { t } = useTranslation('dataset')

  return (
    <Row>
      <Col sm={3}>
        <b>{t('license.title')}</b>
      </Col>
      <Col>
        {license.iconUri && (
          <img
            alt={t(`license.altTextPrefix`) + license.name}
            src={license.iconUri}
            title={license.name}
            style={{ marginRight: '0.5rem' }}
          />
        )}
        <a href={license.uri}>{license.name}</a>
      </Col>
    </Row>
  )
}

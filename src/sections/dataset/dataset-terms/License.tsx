import { Row, Col } from '@iqss/dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
import { Trans, useTranslation } from 'react-i18next'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface LicenseProps {
  license: LicenseModel | undefined
}

export function License({ license }: LicenseProps) {
  const { t } = useTranslation('dataset')

  return (
    <Row>
      <Col sm={3}>
        <b>{t('license.title')}</b>
      </Col>
      <Col>
        <div className={styles['community-norms-text']}>
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
        {!license && <span>{t('termsTab.customTermsHelpText')}</span>}
      </Col>
    </Row>
  )
}

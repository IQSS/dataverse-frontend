import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from '@iqss/dataverse-design-system'
import { requireAppConfig } from '@/config'
import { DataverseInfoRepository } from '../../../info/domain/repositories/DataverseInfoRepository'
import { useDataverseVersion } from './useDataverseVersion'
import dataverseProjectLogo from '@/assets/dataverse-project-logo.svg'
import styles from './Footer.module.scss'

interface FooterProps {
  dataverseInfoRepository: DataverseInfoRepository
}

export function Footer({ dataverseInfoRepository }: FooterProps) {
  const { t } = useTranslation('footer')
  const { dataverseVersion } = useDataverseVersion(dataverseInfoRepository)
  const currentYear = new Date().getFullYear().toString()
  const appConfig = requireAppConfig()
  const copyrightHolder = appConfig.footer?.copyrightHolder ?? 'Dataverse Project'
  const privacyPolicyUrl = appConfig.footer?.privacyPolicyUrl

  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col sm={8}>
            <em className={styles.copyright}>
              {t('copyright', {
                year: currentYear,
                copyrightHolder,
                interpolation: { escapeValue: false }
              })}
              {privacyPolicyUrl && (
                <>
                  {' | '}
                  <a href={privacyPolicyUrl} rel="noreferrer" target="_blank">
                    {t('privacyPolicy')}
                  </a>
                </>
              )}
            </em>
          </Col>
          <Col sm={4}>
            <div className={styles['powered-by-container']}>
              <span className={styles['powered-by-text']}>{t('poweredBy')}</span>
              <a
                href="https://dataverse.org/"
                title="The Dataverse Project"
                target="_blank"
                rel="noreferrer">
                <img
                  src={dataverseProjectLogo}
                  width="118"
                  height="40"
                  alt="The Dataverse Project logo"
                />
              </a>
              <span className={styles.version}>{dataverseVersion}</span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

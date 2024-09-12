import { Container, Row, Col } from '@iqss/dataverse-design-system'
import styles from './Footer.module.scss'
import dataverseProjectLogo from './dataverse-project-logo.svg'
import { useTranslation } from 'react-i18next'
import { DataverseInfoRepository } from '../../../info/domain/repositories/DataverseInfoRepository'
import { useDataverseVersion } from './useDataverseVersion'

interface FooterProps {
  dataverseInfoRepository: DataverseInfoRepository
}

export function Footer({ dataverseInfoRepository }: FooterProps) {
  const { t } = useTranslation('footer')
  const { dataverseVersion } = useDataverseVersion(dataverseInfoRepository)
  const currentYear = new Date().getFullYear().toString()
  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col sm={8}>
            <p className={styles.copyright}>
              {t('copyright', { year: currentYear })}
              <a
                href="https://dataverse.org/best-practices/harvard-dataverse-privacy-policy"
                rel="noreferrer"
                target="_blank">
                {t('privacyPolicy')}
              </a>
            </p>
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

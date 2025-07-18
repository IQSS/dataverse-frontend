import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Tooltip } from '@iqss/dataverse-design-system'
import { InfoCircleFill } from 'react-bootstrap-icons'
import dataverseProjectLogo from '@/assets/dataverse-project-logo.svg'
import { DataverseInfoRepository } from '../../../info/domain/repositories/DataverseInfoRepository'
import { useDataverseVersion } from './useDataverseVersion'
import styles from './Footer.module.scss'

interface FooterProps {
  dataverseInfoRepository: DataverseInfoRepository
}

export function Footer({ dataverseInfoRepository }: FooterProps) {
  const { t } = useTranslation('footer')
  const { dataverseVersion } = useDataverseVersion(dataverseInfoRepository)
  const currentYear = new Date().getFullYear().toString()

  const showExtraVersionNumbers =
    typeof window.__DATAVERSE_FRONTEND_VERSION__ !== 'undefined' &&
    typeof window.__DATAVERSE_CLIENT_JAVASCRIPT_VERSION__ !== 'undefined'

  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col sm={8}>
            <em className={styles.copyright}>
              {t('copyright', { year: currentYear })}
              <a
                href="https://support.dataverse.harvard.edu/harvard-dataverse-privacy-policy"
                rel="noreferrer"
                target="_blank">
                {t('privacyPolicy')}
              </a>
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
              <span className={styles.version}>
                {dataverseVersion}{' '}
                {showExtraVersionNumbers && (
                  <span style={{ verticalAlign: '0.125em' }}>
                    <Tooltip
                      overlay={
                        <div className="p-2">
                          <p className="mb-2">{`Dataverse Frontend: v${
                            window.__DATAVERSE_FRONTEND_VERSION__ as string
                          }`}</p>
                          <p className="mb-0">{`Dataverse Client JavaScript: v${
                            window.__DATAVERSE_CLIENT_JAVASCRIPT_VERSION__ as string
                          }`}</p>
                        </div>
                      }
                      placement="top"
                      maxWidth={350}>
                      <InfoCircleFill />
                    </Tooltip>
                  </span>
                )}
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

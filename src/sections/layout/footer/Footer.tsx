import { Container, Row, Col } from 'dataverse-ui-lib'
import styles from './Footer.module.scss'
import dataverseProjectLogo from './dataverse-project-logo.svg'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation('footer')

  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col sm={8}>
            <p className={styles.copyright}>
              {t('copyright')}
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
              <span className={styles.version}>v. 5.13 build 1244-79d6e57</span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

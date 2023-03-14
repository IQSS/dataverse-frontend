import { Container } from '../../ui/grid/container/Container'
import { Row } from '../../ui/grid/row/Row'
import { Col } from '../../ui/grid/col/Col'
import styles from './Footer.module.scss'
import dataverseProjectLogo from './dataverse-project-logo.svg'

export function Footer() {
  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col sm={8}>
            <p className={styles.copyright}>
              Copyright © 2023, The President &amp; Fellows of Harvard College&nbsp;|&nbsp;{' '}
              <a
                href="https://best-practices.dataverse.org/harvard-policies/harvard-privacy-policy.html"
                rel="noreferrer"
                target="_blank">
                Privacy Policy
              </a>
            </p>
          </Col>
          <Col sm={4}>
            <div className={styles['powered-by-container']}>
              <span className={styles['powered-by-text']}>Powered by</span>
              <a
                className={styles['powered-by-logo']}
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

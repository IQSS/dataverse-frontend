import { Container } from '../../ui/grid/container/Container'
import { Row } from '../../ui/grid/row/Row'
import { Col } from '../../ui/grid/col/Col'
import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col sm={8}>
            <p className={styles.copyright}>
              Copyright © 2023, The President &amp; Fellows of Harvard College&nbsp;|&nbsp;{' '}
              <a
                href="http://best-practices.dataverse.org/harvard-policies/harvard-privacy-policy.html"
                rel="noreferrer"
                target="_blank">
                Privacy Policy
              </a>
            </p>
          </Col>
          <Col sm={4}>2 of 2</Col>
        </Row>
      </Container>
    </footer>
  )
}

import styles from './File.module.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Accordion, Col, Row, Table, Tabs } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'

export function FileSkeleton() {
  const { t } = useTranslation('file')
  return (
    <SkeletonTheme>
      <BreadcrumbsSkeleton />
      <article data-testid="file-skeleton">
        <header className={styles.header}>
          <h1>
            <Skeleton width="15%" />
          </h1>
          <p className={styles.subtext}>
            <Skeleton width="20%" />
          </p>
          <Skeleton width="10%" />
        </header>
        <div className={styles.container}>
          <Row>
            <Col sm={9}>
              <span className={styles['citation-title']}>{t('fileCitationTitle')}</span>
              <Skeleton height="80px" style={{ marginBottom: 20 }} />
              <span className={styles['citation-title']}>{t('datasetCitationTitle')}</span>
              <Skeleton height="80px" style={{ marginBottom: 20 }} />
            </Col>
          </Row>
          <Tabs defaultActiveKey="metadata">
            <Tabs.Tab eventKey="metadata" title={t('tabs.metadata')}>
              <div className={styles['tab-container']}>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{t('metadata.title')}</Accordion.Header>
                    <Accordion.Body>
                      <Row className={styles.row}>
                        <Col sm={3}>
                          <strong>
                            <Skeleton height="24px" />
                          </strong>
                        </Col>
                        <Col>
                          <Skeleton height="400px" width="400px" />
                        </Col>
                      </Row>
                      {Array.from({ length: 25 }, (_, index) => (
                        <Row key={index} className={styles.row}>
                          <Col sm={3}>
                            <strong>
                              <Skeleton height="24px" />
                            </strong>
                          </Col>
                          <Col>
                            <Skeleton height="24px" />
                          </Col>
                        </Row>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="fileVersion" title={t('tabs.fileVersion')}>
              <div className={styles['tab-container']}>
                <Table>
                  <thead>
                    <tr>
                      <th>{t('fileVersion.version')}</th>
                      <th>{t('fileVersion.summary')}</th>
                      <th>{t('fileVersion.contributors')}</th>
                      <th>{t('fileVersion.publishedOn')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <SkeletonTheme>
                          <td style={{ verticalAlign: 'middle' }}>
                            <Skeleton height="18px" width="18px" />
                          </td>
                          <td>
                            <Skeleton height="18px" width="100px" />
                          </td>
                          <td>
                            <Skeleton height="18px" width="250px" />
                          </td>
                          <td>
                            <Skeleton height="18px" width="150px" />
                          </td>
                          <td>
                            <Skeleton height="18px" width="200px" />
                          </td>
                          <td>
                            <Skeleton height="18px" width="120px" />
                          </td>
                        </SkeletonTheme>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tabs.Tab>
          </Tabs>
          <div className={styles['separation-line']}></div>
        </div>
      </article>
    </SkeletonTheme>
  )
}

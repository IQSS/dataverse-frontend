import { Trans, useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import styles from './MetricsResults.module.scss'

const compactNumbersFormatter = Intl.NumberFormat(undefined, {
  notation: 'compact',
  compactDisplay: 'short'
})

interface MetricsResultsProps {
  metrics: InstallationMetrics
}

export const MetricsResults = ({ metrics }: MetricsResultsProps) => {
  const { t } = useTranslation('homepage', { keyPrefix: 'metrics' })
  const {
    lastMonthMetrics: { datasets, files }
  } = metrics

  return (
    <div className={styles.metrics} data-testid="metrics-results">
      <header className={styles.metrics_header}>
        <h4>{t('title')}</h4>
      </header>

      <Row>
        <Col xs={12} md={6} className={styles.dataset_metrics_column}>
          <Row className="text-center mb-4">
            <Col xs={12}>
              <h5 className="h4 text-muted mb-3">{t('datasets')}</h5>
            </Col>
            <Col xs={6} className="mb-4">
              <data className="display-6 fw-bold text-primary" value={datasets.total}>
                {compactNumbersFormatter.format(datasets.total)}
              </data>
              <div className="small text-muted">{t('total')}</div>
            </Col>
            <Col xs={6} className="mb-4">
              <data className="display-6 fw-bold text-primary" value={datasets.lastMonth}>
                {compactNumbersFormatter.format(datasets.lastMonth)}
              </data>
              <div className="small text-muted">{t('lastMonth')}</div>
            </Col>
            <Col xs={6}>
              <data className="display-6 fw-bold text-primary" value={datasets.deposited}>
                {compactNumbersFormatter.format(datasets.deposited)}
              </data>
              <div className="small text-muted">{t('deposited')}</div>
            </Col>
            <Col xs={6}>
              <data className="display-6 fw-bold text-primary" value={datasets.harvested}>
                {compactNumbersFormatter.format(datasets.harvested)}
              </data>
              <div className="small text-muted">{t('harvested')}</div>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6}>
          <Row className="text-center">
            <Col xs={12}>
              <h5 className="h4 text-muted mb-3">{t('files')}</h5>
            </Col>
            <Col xs={6} className="mb-4">
              <data className="display-6 fw-bold text-primary" value={files.downloaded}>
                {compactNumbersFormatter.format(files.downloaded)}
              </data>
              <div className="small text-muted">{t('downloaded')}</div>
            </Col>
            <Col xs={6} className="mb-4">
              <data className="display-6 fw-bold text-primary" value={files.downloadedLastMonth}>
                {compactNumbersFormatter.format(files.downloadedLastMonth)}
              </data>
              <div className="small text-muted">{t('downloadedLastMonth')}</div>
            </Col>
            <Col xs={6}>
              <data className="display-6 fw-bold text-primary" value={files.deposited}>
                {compactNumbersFormatter.format(files.deposited)}
              </data>
              <div className="small text-muted">{t('deposited')}</div>
            </Col>
            <Col xs={6}>
              <data className="display-6 fw-bold text-primary" value={files.depositedLastMonth}>
                {compactNumbersFormatter.format(files.depositedLastMonth)}
              </data>
              <div className="small text-muted">{t('depositedLastMonth')}</div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="text-center py-4">
        <em className="text-muted small">
          <Trans
            t={t}
            i18nKey="poweredByDataverseHub"
            components={{
              a: (
                <a
                  href="https://hub.dataverse.org/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.hub_link}
                />
              )
            }}
          />
        </em>
      </div>
    </div>
  )
}

export const MetricsResultsSkeleton = () => (
  <SkeletonTheme>
    <div data-testid="metrics-results-skeleton">
      <header className={styles.metrics_header}>
        <Skeleton width={200} height={22} />
      </header>

      <Row>
        <Col xs={12} md={6} className={styles.dataset_metrics_column}>
          <Row className="text-center mb-8">
            <Col xs={12}>
              <Skeleton width={120} height={28} className="mb-3" />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6}>
          <Row className="text-center mb-8">
            <Col xs={12}>
              <Skeleton width={120} height={28} className="mb-3" />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6} className="mb-4">
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="text-center py-4">
        <Skeleton width={200} height={22} />
      </div>
    </div>
  </SkeletonTheme>
)

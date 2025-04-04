import SlotCounter from 'react-slot-counter'
import { Trans, useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import styles from './MetricsResults.module.scss'
import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

// Doc about react-slot-counter: https://almond-bongbong.github.io/react-slot-counter/

const compactNumbersFormatter = Intl.NumberFormat(undefined, {
  notation: 'compact',
  compactDisplay: 'short'
})

const SLOT_PROPS = {
  duration: 1.6,
  speed: 0.6,
  animateOnVisible: { triggerOnce: true, rootMargin: '0px 0px -50px 0px' },
  containerClassName: styles.slot_container,
  delay: 0.25
}

interface MetricsResultsProps {
  metrics: InstallationMetrics
  prefersReducedMotion: boolean
}

export const MetricsResults = ({ metrics, prefersReducedMotion }: MetricsResultsProps) => {
  const { t } = useTranslation('homepage', { keyPrefix: 'metrics' })

  console.log(metrics)

  return (
    <div className={styles.metrics}>
      <header className={styles.metrics_header}>
        <h4>{t('title')}</h4>

        <em className="text-muted small">
          <Trans
            t={t}
            i18nKey="poweredByDataverseHub"
            components={{
              a: <a href="https://hub.dataverse.org/" target="_blank" rel="noreferrer" />
            }}
          />
        </em>
      </header>

      <Row>
        <Col xs={12} md={6} className={styles.dataset_metrics_column}>
          <Row className="text-center mb-4">
            <Col xs={12}>
              <h5 className="h4 text-muted mb-3">{t('datasets')}</h5>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(187911)}
                  startValue={!prefersReducedMotion ? '000K' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('total')}</div>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(2162)}
                  startValue={!prefersReducedMotion ? '00K' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('past30days')}</div>
            </Col>

            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(101869)}
                  startValue={!prefersReducedMotion ? '000K' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('deposited')}</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(86042)}
                  startValue={!prefersReducedMotion ? '00K' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
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
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(91514796)}
                  startValue={!prefersReducedMotion ? '00M' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('downloaded')}</div>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(4761951)}
                  startValue={!prefersReducedMotion ? '00M' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('download30days')}</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(2302964)}
                  startValue={!prefersReducedMotion ? '000M' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('deposited')}</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter
                  value={compactNumbersFormatter.format(61622)}
                  startValue={!prefersReducedMotion ? '00K' : /* istanbul ignore next */ undefined}
                  {...SLOT_PROPS}
                />
              </div>
              <div className="small text-muted">{t('deposited30days')}</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export const MetricsResultsSkeleton = () => (
  <SkeletonTheme>
    <div>
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

            <Col xs={6}>
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6}>
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
            <Col xs={6}>
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
            <Col xs={6}>
              <Skeleton width={130} height={40} />
              <Skeleton width={55} height={20} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </SkeletonTheme>
)

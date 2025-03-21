import SlotCounter from 'react-slot-counter'
import { useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import styles from './Metrics.module.scss'

// Doc about react-slot-counter: https://almond-bongbong.github.io/react-slot-counter/

const SLOTS_DURATION = 1.6
const SLOTS_SPEED = 0.6
const SLOTS_ANIMATE_ON_VISIBLE = { triggerOnce: true, rootMargin: '0px 0px -50px 0px' }
const SLOT_PROPS = {
  duration: SLOTS_DURATION,
  speed: SLOTS_SPEED,
  animateOnVisible: SLOTS_ANIMATE_ON_VISIBLE,
  containerClassName: styles.slot_container,
  delay: 0.25
}

const compactNumbersFormatter = Intl.NumberFormat(undefined, {
  notation: 'compact',
  compactDisplay: 'short'
})

export const Metrics = () => {
  const { t } = useTranslation('homepage', { keyPrefix: 'metrics' })
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div className={styles.metrics}>
      <h4>{t('title')}</h4>

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

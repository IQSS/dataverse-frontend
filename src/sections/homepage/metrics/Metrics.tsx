import SlotCounter from 'react-slot-counter'
import { Col, Row } from '@iqss/dataverse-design-system'
import styles from './Metrics.module.scss'

// Doc about react-slot-counter: https://almond-bongbong.github.io/react-slot-counter/

const SLOTS_DURATION = 1.6
const SLOTS_SPEED = 0.6
const SLOTS_ANIMATE_ON_VISIBLE = { triggerOnce: false, rootMargin: '0px 0px -150px 0px' }
const SLOT_PROPS = {
  duration: SLOTS_DURATION,
  speed: SLOTS_SPEED,
  animateOnVisible: SLOTS_ANIMATE_ON_VISIBLE,
  containerClassName: styles.slot_container
}

const compactNumbersFormatter = Intl.NumberFormat(undefined, {
  notation: 'compact',
  compactDisplay: 'short'
})

export const Metrics = () => {
  return (
    <div className={styles.metrics}>
      <h4>Activity</h4>

      <Row>
        <Col xs={12} md={6} className={styles.dataset_metrics_column}>
          <Row className="text-center mb-4">
            <Col xs={12}>
              <h5 className="h4 text-muted mb-3">Datasets</h5>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(187911)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Total</div>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(2162)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Past 30 Days</div>
            </Col>

            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(101869)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Deposited</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(86042)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Harvested</div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6}>
          <Row className="text-center">
            <Col xs={12}>
              <h5 className="h4 text-muted mb-3">Files</h5>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(91514796)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Downloaded</div>
            </Col>
            <Col xs={6} className="mb-4">
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(4761951)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Downloads (30 days)</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(2302964)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Deposited</div>
            </Col>
            <Col xs={6}>
              <div className="display-6 fw-bold text-primary">
                <SlotCounter value={compactNumbersFormatter.format(61622)} {...SLOT_PROPS} />
              </div>
              <div className="small text-muted">Deposited (30 days)</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

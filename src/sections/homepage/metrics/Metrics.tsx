import SlotCounter from 'react-slot-counter'
import { Col, Row } from '@iqss/dataverse-design-system'
import styles from './Metrics.module.scss'

// Doc about react-slot-counter: https://almond-bongbong.github.io/react-slot-counter/

const SLOTS_DURATION = 1.6
const SLOTS_SPEED = 0.6
const SLOTS_ANIMATE_ON_VISIBLE = { triggerOnce: false, rootMargin: '0px 0px -100px 0px' }
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

      {/* New */}

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

      {/* Classic view */}
      {/* <Row>
        <Col xs={12} md={6}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Datasets</th>
                <th scope="col">All Activity</th>
                <th scope="col">Past 30 Days</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">All</th>
                <td>
                  <SlotCounter value="187,911" {...SLOT_PROPS} />
                </td>
                <td>
                  <SlotCounter value="2,162" {...SLOT_PROPS} />
                </td>
              </tr>
              <tr>
                <th scope="row">Deposited</th>
                <td>
                  <SlotCounter value="101,869" {...SLOT_PROPS} />
                </td>
                <td>
                  <SlotCounter value="1,780" startValue="0,000" {...SLOT_PROPS} />
                </td>
              </tr>
              <tr>
                <th scope="row">Harvested</th>
                <td>
                  <SlotCounter value="86,042" {...SLOT_PROPS} />
                </td>
                <td>
                  <SlotCounter value="382" {...SLOT_PROPS} />
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs={12} md={6}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Files</th>
                <th scope="col">All Activity</th>
                <th scope="col">Past 30 Days</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Downloaded</th>
                <td>
                  <SlotCounter value="91,514,796" {...SLOT_PROPS} />
                </td>
                <td>
                  <SlotCounter value="4,761,951" {...SLOT_PROPS} />
                </td>
              </tr>
              <tr>
                <th scope="row">Deposited</th>
                <td>
                  <SlotCounter value="2,302,964" {...SLOT_PROPS} />
                </td>
                <td>
                  <SlotCounter value="61,622" {...SLOT_PROPS} />
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row> */}
    </div>
  )
}

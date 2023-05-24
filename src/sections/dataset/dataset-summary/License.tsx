import { Row, Col } from 'dataverse-design-system'
import { DatasetLicense as LicenseModel } from '../../../dataset/domain/models/Dataset'
interface LicenseProps {
  license: LicenseModel
}

export function License({ license }: LicenseProps) {
  return (
    <article>
      <Row>
        <Col sm={3}>
          <b>License/Data Use Agreement</b>
        </Col>
        <Col>
          {' '}
          <img
            alt={license.name + ' license icon'}
            src={license.iconUrl}
            title={license.shortDescription}></img>{' '}
          <a href={license.uri}>{license.name}</a>
        </Col>
      </Row>
    </article>
  )
}

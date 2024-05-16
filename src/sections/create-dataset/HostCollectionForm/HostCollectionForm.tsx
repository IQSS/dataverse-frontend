import { Col, Row } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

const description = 'The host collection of the dataset.'
interface HostCollectionFormProps {
  collectionId: string
}

export function HostCollectionForm({ collectionId }: HostCollectionFormProps) {
  const { t } = useTranslation('createDataset')
  return (
    <Form>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label message={t('hostCollection.description')} column sm={3} required>
          {t('hostCollection.label')}
        </Form.Group.Label>
        <Col sm={6}>
          <Row>{t('hostCollection.helpText')}</Row>
          <Row>
            <Form.Group.Input type="text" disabled defaultValue={collectionId} />
          </Row>
        </Col>
      </Form.Group>
    </Form>
  )
}

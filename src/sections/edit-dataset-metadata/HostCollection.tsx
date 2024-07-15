import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'

interface HostCollectionProps {
  collectionName: string
}

export const HostCollection = ({ collectionName }: HostCollectionProps) => {
  const { t } = useTranslation('editDatasetMetadata')

  return (
    <Form.Group>
      <Form.Group.Label message={t('hostCollection.description')} column sm={3}>
        {t('hostCollection.label')}
      </Form.Group.Label>
      <Col sm={9}>
        <Form.Group.Input readOnly defaultValue={collectionName} />
      </Col>
    </Form.Group>
  )
}

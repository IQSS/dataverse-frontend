import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'
import { Dataset } from '../../dataset/domain/models/Dataset'

interface HostCollectionProps {
  dataset: Dataset
}

export const HostCollection = ({ dataset }: HostCollectionProps) => {
  const { t } = useTranslation('editDatasetMetadata')

  const datasetParentCollectionName = dataset.hierarchy
    .toArray()
    .filter((item) => item.type === 'collection')
    .at(-1)?.name

  return (
    <Form.Group>
      <Form.Group.Label message={t('hostCollection.description')} column sm={3}>
        {t('hostCollection.label')}
      </Form.Group.Label>
      <Col sm={9}>
        <Form.Group.Input
          readOnly
          defaultValue={datasetParentCollectionName ?? 'Host collection name not found'}
        />
      </Col>
    </Form.Group>
  )
}

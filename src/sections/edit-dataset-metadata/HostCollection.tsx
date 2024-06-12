import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'
import { UpwardHierarchyNode } from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface HostCollectionProps {
  datasetHierarchy: UpwardHierarchyNode
}

export const HostCollection = ({ datasetHierarchy }: HostCollectionProps) => {
  const { t } = useTranslation('editDatasetMetadata')

  const datasetParentCollectionName = useMemo(
    () =>
      datasetHierarchy
        .toArray()
        .filter((item) => item.type === 'collection')
        .at(-1)?.name,
    [datasetHierarchy]
  )

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

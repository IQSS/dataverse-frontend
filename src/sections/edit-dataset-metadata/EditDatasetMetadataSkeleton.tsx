import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Row, Col, Tabs } from '@iqss/dataverse-design-system'
import { BreadcrumbsSkeleton } from '../shared/hierarchy/BreadcrumbsSkeleton'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import 'react-loading-skeleton/dist/skeleton.css'

export function EditDatasetMetadataSkeleton() {
  const { t } = useTranslation('editDatasetMetadata')

  return (
    <SkeletonTheme>
      <section data-testid="edit-dataset-metadata-skeleton">
        <BreadcrumbsSkeleton />
        <Skeleton height="58px" style={{ marginBottom: 16 }} />
        <Row style={{ marginBottom: 20 }}>
          <Col sm={3}>
            <Skeleton height="30px" width="150px" />
          </Col>
          <Col sm={9}>
            <Skeleton height="30px" width="150px" />
          </Col>
        </Row>
        <SeparationLine />
        <Tabs defaultActiveKey="metadata">
          <Tabs.Tab eventKey="metadata" title={t('metadata')}>
            <Skeleton height="1000px" style={{ marginTop: 20 }} />
          </Tabs.Tab>
        </Tabs>
      </section>
    </SkeletonTheme>
  )
}

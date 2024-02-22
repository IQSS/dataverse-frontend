import { Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface HomeProps {
  datasetRepository: DatasetRepository
  page?: number
}

export function Home({ datasetRepository, page }: HomeProps) {
  const { t } = useTranslation('home')

  return (
    <Row>
      <BreadcrumbsGenerator
        hierarchy={new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, undefined, undefined)}
      />
      <header>
        <h1>{t('title')}</h1>
      </header>
      <DatasetsList datasetRepository={datasetRepository} page={page} />
    </Row>
  )
}

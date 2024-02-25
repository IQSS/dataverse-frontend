import { Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { useSession } from '../session/SessionContext'
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
  const { user } = useSession()

  return (
    <Row>
      <BreadcrumbsGenerator hierarchy={new UpwardHierarchyNode('Root', DvObjectType.COLLECTION)} />
      <header>
        <h1>{t('title')}</h1>
      </header>
      {user && (
        <div className={'d-flex justify-content-end mb-3'}>
          <AddDataActionsButton />
        </div>
      )}
      <DatasetsList datasetRepository={datasetRepository} page={page} />
    </Row>
  )
}

import { Container } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { useSession } from '../session/SessionContext'
interface HomeProps {
  datasetRepository: DatasetRepository
}

export function Home({ datasetRepository }: HomeProps) {
  const { user } = useSession()
  const { t } = useTranslation('home')

  return (
    <Container>
      <header>
        <h1>{t('title')}</h1>
      </header>
      {user && (
        <div className="mx-auto">
          <AddDataActionsButton />
        </div>
      )}
      <DatasetsList datasetRepository={datasetRepository} />
    </Container>
  )
}

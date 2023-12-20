import { Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
interface HomeProps {
  datasetRepository: DatasetRepository
}

export function Home({ datasetRepository }: HomeProps) {
  const { t } = useTranslation('home')

  return (
    <Row>
      <header>
        <h1>{t('title')}</h1>
      </header>
      <DatasetsList datasetRepository={datasetRepository} />
    </Row>
  )
}

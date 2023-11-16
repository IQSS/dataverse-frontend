import styles from './Home.module.scss'
import { Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useDatasets } from './useDatasets'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'

interface HomeProps {
  datasetRepository: DatasetRepository
}

export function Home({ datasetRepository }: HomeProps) {
  const { t } = useTranslation('home')
  const { datasets } = useDatasets(datasetRepository)

  return (
    <Row>
      <header>
        <h1 className={styles.title}>{t('title')}</h1>
      </header>
      <section className={styles.container}>
        <div className={styles.results}>
          <p>1 to 10 of 41 Results</p>
        </div>
        {datasets.map((dataset) => (
          <article key={dataset.persistentId}>
            <a href={`/datasets?persistentId=${dataset.persistentId}`}>{dataset.getTitle()}</a>
          </article>
        ))}
      </section>
    </Row>
  )
}

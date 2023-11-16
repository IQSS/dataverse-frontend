import { useDatasets } from '../useDatasets'
import styles from '../Home.module.scss'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'

interface DatasetsListProps {
  datasetRepository: DatasetRepository
}
export function DatasetsList({ datasetRepository }: DatasetsListProps) {
  const { datasets } = useDatasets(datasetRepository)

  return (
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
  )
}

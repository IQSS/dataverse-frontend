import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import styles from './CollectionItemsPanel.module.scss'

interface ItemsPanelProps {
  collectionId: string
  datasetRepository: DatasetRepository
  addDataSlot: JSX.Element | null
}

export const CollectionItemsPanel = ({
  collectionId,
  datasetRepository,
  addDataSlot
}: ItemsPanelProps) => {
  return (
    <section className={styles['items-panel']}>
      <header className={styles['top-wrapper']}>
        <SearchPanel />
        <div className={styles['add-data-slot']}>{addDataSlot}</div>
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel />

        <ItemsList collectionId={collectionId} datasetRepository={datasetRepository} />
      </div>
    </section>
  )
}

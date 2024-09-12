import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import styles from './ItemsPanel.module.scss'

interface ItemsPanelProps {
  addDataSlot: JSX.Element | null
}

export const ItemsPanel = ({ addDataSlot }: ItemsPanelProps) => {
  return (
    <section className={styles['items-panel']}>
      <header className={styles['top-wrapper']}>
        <SearchPanel />
        <div className={styles['add-data-slot']}>{addDataSlot}</div>
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel />

        <ItemsList />
      </div>
    </section>
  )
}

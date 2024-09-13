import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import styles from './ItemsList.module.scss'

interface ItemsListProps {
  collectionId: string
  datasetRepository: DatasetRepository
}

export const ItemsList = ({ collectionId, datasetRepository }: ItemsListProps) => {
  return (
    <div className={styles['items-list']}>
      <p>New List goes here</p>
    </div>
  )
}

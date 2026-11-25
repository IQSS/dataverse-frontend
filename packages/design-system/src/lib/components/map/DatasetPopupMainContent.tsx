import { CustomPopupDatasetItem, DefaultPopupDatasetItem, GeoDatasetItem } from './types'
import styles from './MarkerClusterGroup.module.scss'

function hasCustomPopupContent(item: GeoDatasetItem): item is CustomPopupDatasetItem {
  return item.popupContent !== undefined
}

function DefaultDatasetPopupContent({ item }: { item: DefaultPopupDatasetItem }) {
  return (
    <>
      <a href={item.detailsPageUrl}>{item.name}</a>
      <br />
      {item.authors}; {item.publicationDate}
      <br />
      {item.persistentId}
    </>
  )
}

export function DatasetPopupMainContent({ item }: { item: GeoDatasetItem }) {
  return (
    <div className={styles['dataset-details']}>
      {hasCustomPopupContent(item) ? item.popupContent : <DefaultDatasetPopupContent item={item} />}
    </div>
  )
}

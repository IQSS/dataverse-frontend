import { CustomPopupDatasetItem, DefaultPopupDatasetItem, GeoDatasetItem } from './types'
import styles from './MarkerClusterGroup.module.scss'
import { Fullscreen } from 'react-bootstrap-icons'
import { Tooltip } from '../tooltip/Tooltip'

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

interface DatasetPopupContentProps {
  item: GeoDatasetItem
  boundingBoxCount: number
  onBringBoundingBoxesIntoView: () => void
}

export function DatasetPopupContent({
  item,
  boundingBoxCount,
  onBringBoundingBoxesIntoView
}: DatasetPopupContentProps) {
  const moveViewLabel = `Move view to bounding ${boundingBoxCount === 1 ? 'box' : 'boxes'}`

  return (
    <div>
      <DatasetPopupMainContent item={item} />
      <div className={styles['dataset-popup-actions']}>
        <Tooltip placement="right" overlay={moveViewLabel}>
          <button
            type="button"
            className={styles['dataset-popup-action']}
            aria-label={moveViewLabel}
            onClick={onBringBoundingBoxesIntoView}>
            <Fullscreen aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

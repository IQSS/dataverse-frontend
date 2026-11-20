import L from 'leaflet'
import { useEffect, useState } from 'react'
import { Popup, useMap } from 'react-leaflet'
import { GeoDatasetItem } from './types'
import { markerPinPopupAnchor } from './MarkerClusterIcons'
import { createBoundingBox } from './mapAreaPreview'
import styles from './MarkerClusterGroup.module.scss'

// Explicit 7px popup offset is needed because this popup is positioned independently of its marker.
const terminalClusterPopupOffset = markerPinPopupAnchor.add(L.point(0, 7))

export interface TerminalPopupItem {
  item: GeoDatasetItem
  bboxes: GeoDatasetItem['bboxes']
}

export interface TerminalPopupState {
  position: L.LatLng
  items: TerminalPopupItem[]
}

interface Props extends TerminalPopupState {
  boundingBoxColor: string
  onClose: () => void
}

export function TerminalClusterPopup({ position, items, boundingBoxColor, onClose }: Props) {
  const map = useMap()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pageInput, setPageInput] = useState('1')
  const currentEntry = items[currentIndex]
  const currentItem = currentEntry.item

  useEffect(() => {
    setPageInput(String(currentIndex + 1))
  }, [currentIndex])

  useEffect(() => {
    const rectangles = currentEntry.bboxes.map((bounds) =>
      createBoundingBox(bounds, boundingBoxColor).addTo(map)
    )

    if (rectangles.length > 0) {
      const combinedBounds = L.featureGroup(rectangles).getBounds()
      if (!map.getBounds().contains(combinedBounds)) {
        map.fitBounds(combinedBounds, { padding: [20, 20] })
      }
    }

    return () => {
      rectangles.forEach((rectangle) => map.removeLayer(rectangle))
    }
  }, [boundingBoxColor, currentEntry, map])

  const showPreviousItem = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length)
  }

  const showNextItem = () => {
    setCurrentIndex((current) => (current + 1) % items.length)
  }

  const showEnteredItem = (value: string) => {
    setPageInput(value)

    const page = Number(value)
    if (Number.isInteger(page) && page >= 1 && page <= items.length) {
      setCurrentIndex(page - 1)
    }
  }

  const resetPageInputIfInvalid = () => {
    setPageInput(String(currentIndex + 1))
  }

  return (
    <Popup
      position={position}
      offset={terminalClusterPopupOffset}
      eventHandlers={{ remove: onClose }}>
      <div className={styles['carousel-popup']}>
        <div className={styles['dataset-details']}>
          <a href={currentItem.detailsPageUrl}>{currentItem.name}</a>
          <br />
          {currentItem.authors}; {currentItem.publicationDate}
          <br />
          {currentItem.persistentId}
        </div>
        <div className={styles['carousel-controls']}>
          <button
            type="button"
            className={styles['carousel-button']}
            aria-label="Previous dataset"
            onClick={showPreviousItem}>
            &lsaquo;
          </button>
          <div className={styles['carousel-position']}>
            <input
              className={styles['carousel-page-input']}
              type="number"
              min={1}
              max={items.length}
              value={pageInput}
              aria-label={`Dataset number, 1 to ${items.length}`}
              onChange={(event) => showEnteredItem(event.target.value)}
              onBlur={resetPageInputIfInvalid}
              onFocus={(event) => event.currentTarget.select()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
            />
            <span>/ {items.length}</span>
          </div>
          <button
            type="button"
            className={styles['carousel-button']}
            aria-label="Next dataset"
            onClick={showNextItem}>
            &rsaquo;
          </button>
        </div>
      </div>
    </Popup>
  )
}

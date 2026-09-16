import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Button } from '../button/Button'
import { QuestionMarkTooltip } from '../tooltip/question-mark-tooltip/QuestionMarkTooltip'
import { MarkerClusterGroup } from './MarkerClusterGroup'
import { CollectionMapData } from './types'
import styles from './DatasetsMap.module.scss'

function MapSizeInvalidator({ isVisible }: { isVisible: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => map.invalidateSize(), 0)
    }
  }, [isVisible, map])
  return null
}

export function DatasetsMap({
  isVisible,
  items,
  totalCount,
  isLoading,
  error,
  hasMore,
  loadMore,
  mapHeight
}: CollectionMapData) {
  return (
    <div className={styles['map-wrapper']}>
      <div className={styles['map-status']}>
        {isLoading ? (
          <SkeletonTheme>
            <Skeleton height={19} width={190} />
          </SkeletonTheme>
        ) : (
          <span className={styles['results']}>
            {`${items.length} of ${new Intl.NumberFormat().format(totalCount)} results displayed`}{' '}
            <QuestionMarkTooltip
              placement="right"
              message="The map shows only search results that have geospatial information, most relevant first."
            />
          </span>
        )}
        {hasMore && (
          <Button variant="link" type="button" size="sm" onClick={loadMore} disabled={isLoading}>
            Load more
          </Button>
        )}
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      <MapContainer
        center={[51.1, 10.382]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: mapHeight }}
        className={styles['map-container']}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MarkerClusterGroup items={items} />
        <MapSizeInvalidator isVisible={isVisible} />
      </MapContainer>
    </div>
  )
}

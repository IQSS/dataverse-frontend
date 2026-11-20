import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import {
  DatasetMapColors,
  DatasetMarkerPlacement,
  GeoDatasetItem,
  TerminalClusterBehavior
} from './types'
import { getDatasetMarkerPosition } from './getDatasetMarkerPosition'
import { isTerminalCluster } from './isTerminalCluster'
import { createClusterIcon, createMarkerPinIcon, resolveClusterColors } from './MarkerClusterIcons'
import { TerminalClusterPopup, TerminalPopupState } from './TerminalClusterPopup'
import { areaPreviewStyle, createBoundingBox } from './mapAreaPreview'

interface Props {
  items: GeoDatasetItem[]
  colors?: DatasetMapColors
  terminalClusterBehavior: TerminalClusterBehavior
  markerPlacement: DatasetMarkerPlacement
}

interface IndexedDatasetMarker {
  item: GeoDatasetItem
  bboxes: GeoDatasetItem['bboxes']
  index: number
}

interface ClusterActivationEvent extends L.LeafletEvent {
  layer: L.MarkerCluster
  originalEvent?: KeyboardEvent
}

export function MarkerClusterGroup({
  items,
  colors,
  terminalClusterBehavior,
  markerPlacement
}: Props) {
  const map = useMap()
  const [terminalPopup, setTerminalPopup] = useState<TerminalPopupState | null>(null)

  const boundingBoxColor = colors?.boundingBox ?? '#3388ff'
  const pinPrimary = colors?.pinPrimary ?? '#3388ff'
  const pinSecondary = colors?.pinSecondary ?? '#fff'
  const terminalPinPrimary = colors?.terminalPinPrimary ?? '#3388ff'
  const terminalPinSecondary = colors?.terminalPinSecondary ?? '#fff'
  const clusterSmall = colors?.clusterSmall ?? '#6ecc39'
  const clusterMedium = colors?.clusterMedium ?? '#f0c20c'
  const clusterLarge = colors?.clusterLarge ?? '#f18017'
  const clusterPreview = colors?.clusterPreview ?? '#3388ff'

  useEffect(() => {
    setTerminalPopup(null)

    const markerIcon = createMarkerPinIcon(1, 'dataset-map-dataset-marker', {
      fill: pinPrimary,
      border: pinSecondary,
      text: pinSecondary
    })
    const terminalPinColors = {
      fill: terminalPinPrimary,
      border: terminalPinSecondary,
      text: terminalPinSecondary
    }
    const clusterColors = {
      small: resolveClusterColors(clusterSmall),
      medium: resolveClusterColors(clusterMedium),
      large: resolveClusterColors(clusterLarge)
    }

    const itemByMarker = new Map<L.Marker, IndexedDatasetMarker>()
    const hideMarkerRectangles: (() => void)[] = []
    const pendingClusterRestores = new Set<ReturnType<typeof setTimeout>>()
    const cluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      zoomToBoundsOnClick: false,
      polygonOptions: {
        ...areaPreviewStyle,
        color: clusterPreview,
        fillColor: clusterPreview
      },
      iconCreateFunction: (markerCluster) =>
        createClusterIcon(
          isTerminalCluster(markerCluster),
          markerCluster.getChildCount(),
          terminalPinColors,
          clusterColors
        )
    })

    const markerItems = items.flatMap((item) => {
      const datasetCenter = getDatasetMarkerPosition(item.bboxes)

      return markerPlacement === 'bounding-box-centers'
        ? item.bboxes.map((bbox) => ({
            item,
            bboxes: [bbox],
            position: getDatasetMarkerPosition([bbox])
          }))
        : [{ item, bboxes: item.bboxes, position: datasetCenter }]
    })

    const markerList = markerItems.map(({ item, bboxes, position }, index) => {
      const marker = L.marker(position, {
        icon: markerIcon
      })
      itemByMarker.set(marker, { item, bboxes, index })

      let rects: L.Rectangle[] = []
      let inCluster = true

      const showRects = () => {
        if (rects.length === 0) {
          rects = bboxes.map((bounds) => createBoundingBox(bounds, boundingBoxColor))
          rects.forEach((rectangle) => map.addLayer(rectangle))
        }
      }

      const hideRects = () => {
        rects.forEach((rectangle) => map.removeLayer(rectangle))
        rects = []
      }
      hideMarkerRectangles.push(hideRects)

      marker.on('mouseover', showRects)

      marker.on('mouseout', () => {
        if (!marker.isPopupOpen()) {
          hideRects()
        }
      })

      marker.on('click', () => {
        if (inCluster) {
          // while a pin's popup is open, clustering logic shouldn't mess with it
          cluster.removeLayer(marker)
          map.addLayer(marker)
          inCluster = false

          showRects()
          if (rects.length > 0) {
            const combinedBounds = L.featureGroup(rects).getBounds()
            if (!map.getBounds().contains(combinedBounds)) {
              map.fitBounds(combinedBounds, { padding: [20, 20] })
            }
          }
        }
      })

      marker.bindPopup(
        `<a href="${item.detailsPageUrl}">${item.name}</a><br>` +
          `${item.authors}; ${item.publicationDate}<br>` +
          `${item.persistentId}`
      )

      marker.on('popupclose', () => {
        hideRects()

        // Delay reclustering until the newly clicked marker opened, to prevent the cluster collapsing around it.
        const restoreTimeout = setTimeout(() => {
          pendingClusterRestores.delete(restoreTimeout)
          if (!marker.isPopupOpen() && !inCluster) {
            inCluster = true
            map.removeLayer(marker)
            cluster.addLayer(marker)
          }
        }, 0)
        pendingClusterRestores.add(restoreTimeout)
      })

      return marker
    })

    const activateCluster = (event: ClusterActivationEvent) => {
      const isEnterKeyActivation =
        event.type === 'clusterkeypress' && event.originalEvent?.keyCode === 13

      if (
        event.type === 'clusterkeypress' &&
        event.originalEvent &&
        event.originalEvent.keyCode !== 13
      ) {
        return
      }

      const markerCluster = event.layer
      if (!isTerminalCluster(markerCluster)) {
        setTerminalPopup(null)
        markerCluster.zoomToBounds()
      } else if (terminalClusterBehavior === 'spiderfy') {
        setTerminalPopup(null)
        markerCluster.spiderfy()
      } else {
        const clusterItems = markerCluster
          .getAllChildMarkers()
          .map((marker) => itemByMarker.get(marker))
          .filter((entry): entry is IndexedDatasetMarker => entry !== undefined)
          .sort((first, second) => first.index - second.index)
          .map(({ item, bboxes }) => ({ item, bboxes }))

        if (clusterItems.length > 0) {
          setTerminalPopup({ position: markerCluster.getLatLng(), items: clusterItems })
        }
      }

      // The activated cluster may be replaced during zooming or spiderfying.
      if (isEnterKeyActivation) {
        map.getContainer().focus()
      }
    }

    cluster.on('clusterclick clusterkeypress', activateCluster as L.LeafletEventHandlerFn)
    cluster.addLayers(markerList)
    map.addLayer(cluster)

    if (markerList.length > 0) {
      map.fitBounds(cluster.getBounds())
    }

    return () => {
      cluster.off('clusterclick clusterkeypress', activateCluster as L.LeafletEventHandlerFn)
      pendingClusterRestores.forEach((restoreTimeout) => clearTimeout(restoreTimeout))
      hideMarkerRectangles.forEach((hideRectangles) => hideRectangles())
      for (const marker of markerList) {
        if (map.hasLayer(marker)) map.removeLayer(marker)
      }
      map.removeLayer(cluster)
    }
  }, [
    map,
    items,
    boundingBoxColor,
    pinPrimary,
    pinSecondary,
    terminalPinPrimary,
    terminalPinSecondary,
    clusterSmall,
    clusterMedium,
    clusterLarge,
    clusterPreview,
    terminalClusterBehavior,
    markerPlacement
  ])

  return terminalPopup ? (
    <TerminalClusterPopup
      key={`${terminalPopup.position.lat},${terminalPopup.position.lng}:${terminalPopup.items
        .map(({ item }) => item.persistentId)
        .join('|')}`}
      position={terminalPopup.position}
      items={terminalPopup.items}
      boundingBoxColor={boundingBoxColor}
      onClose={() => setTerminalPopup(null)}
    />
  ) : null
}

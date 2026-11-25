import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
import { DatasetPopupContent } from './DatasetPopupMainContent'
import { fitBoundingBoxes } from './fitBoundingBoxes'

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

interface DisplayedTerminalPopup extends TerminalPopupState {
  onClose: () => void
}

interface DisplayedDatasetPopup {
  container: HTMLDivElement
  item: GeoDatasetItem
  bboxes: GeoDatasetItem['bboxes']
  popup: L.Popup
}

interface ActiveTerminalMarker {
  marker: L.Marker
  childMarkers: L.Marker[]
  popup: DisplayedTerminalPopup
  restoreTimeout?: ReturnType<typeof setTimeout>
  restored: boolean
}

function DatasetPopupPortal({ container, item, bboxes, popup }: DisplayedDatasetPopup) {
  const map = useMap()

  useLayoutEffect(() => {
    popup.update()

    let updateFrame: number | undefined
    const resizeObserver = new ResizeObserver(() => {
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
      updateFrame = requestAnimationFrame(() => popup.update())
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
    }
  }, [container, popup])

  return createPortal(
    <DatasetPopupContent
      item={item}
      boundingBoxCount={bboxes.length}
      onBringBoundingBoxesIntoView={() => fitBoundingBoxes(map, bboxes)}
    />,
    container
  )
}

export function MarkerClusterGroup({
  items,
  colors,
  terminalClusterBehavior,
  markerPlacement
}: Props) {
  const map = useMap()
  const [terminalPopup, setTerminalPopup] = useState<DisplayedTerminalPopup | null>(null)
  const [datasetPopup, setDatasetPopup] = useState<DisplayedDatasetPopup | null>(null)

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
    setDatasetPopup(null)

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
    const hideClusteredMarkerRectangles: (() => void)[] = []
    const pendingClusterRestores = new Set<ReturnType<typeof setTimeout>>()
    let activeTerminalMarker: ActiveTerminalMarker | null = null
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
      hideClusteredMarkerRectangles.push(() => {
        if (!marker.isPopupOpen() && cluster.getVisibleParent(marker) !== marker) {
          hideRects()
        }
      })

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
        }
      })

      const popupContainer = document.createElement('div')
      marker.bindPopup(popupContainer)
      const popup = marker.getPopup()
      marker.on('popupopen', () => {
        if (popup) setDatasetPopup({ container: popupContainer, item, bboxes, popup })
      })

      marker.on('popupclose', () => {
        setDatasetPopup((currentPopup) =>
          currentPopup?.container === popupContainer ? null : currentPopup
        )
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

    const hideClusteredRectangles = () => {
      hideClusteredMarkerRectangles.forEach((hideRectangles) => hideRectangles())
    }
    map.on('moveend', hideClusteredRectangles)
    cluster.on('animationend', hideClusteredRectangles)

    const restoreTerminalMarker = (activeMarker: ActiveTerminalMarker) => {
      if (activeMarker.restored) return

      activeMarker.restored = true
      map.removeLayer(activeMarker.marker)
      cluster.addLayers(activeMarker.childMarkers)
      if (activeTerminalMarker === activeMarker) activeTerminalMarker = null
    }

    const scheduleTerminalMarkerRestore = (activeMarker: ActiveTerminalMarker) => {
      if (activeMarker.restored || activeMarker.restoreTimeout !== undefined) return

      // lets another clicked marker open before reclustering this one.
      const restoreTimeout = setTimeout(() => {
        pendingClusterRestores.delete(restoreTimeout)
        activeMarker.restoreTimeout = undefined
        restoreTerminalMarker(activeMarker)
      }, 0)
      activeMarker.restoreTimeout = restoreTimeout
      pendingClusterRestores.add(restoreTimeout)
    }

    const keepTerminalMarkerOpen = (markerCluster: L.MarkerCluster, popup: TerminalPopupState) => {
      const childMarkers = markerCluster.getAllChildMarkers()

      if (activeTerminalMarker) restoreTerminalMarker(activeTerminalMarker)

      cluster.removeLayers(childMarkers)
      const marker = L.marker(popup.position, {
        icon: createMarkerPinIcon(
          childMarkers.length,
          'dataset-map-terminal-marker',
          terminalPinColors
        )
      })
      const displayedPopup: DisplayedTerminalPopup = {
        ...popup,
        onClose: () => {
          setTerminalPopup((currentPopup) =>
            currentPopup === displayedPopup ? null : currentPopup
          )
          scheduleTerminalMarkerRestore(activeMarker)
        }
      }
      const activeMarker: ActiveTerminalMarker = {
        marker,
        childMarkers,
        popup: displayedPopup,
        restored: false
      }

      marker.on('click', () => {
        if (activeMarker.restoreTimeout !== undefined) {
          clearTimeout(activeMarker.restoreTimeout)
          pendingClusterRestores.delete(activeMarker.restoreTimeout)
          activeMarker.restoreTimeout = undefined
        }
        if (!activeMarker.restored) setTerminalPopup(activeMarker.popup)
      })
      marker.addTo(map)
      activeTerminalMarker = activeMarker
      setTerminalPopup(displayedPopup)
    }

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
          .map(({ item, bboxes, index }) => ({ item, bboxes, index }))

        if (clusterItems.length > 0) {
          keepTerminalMarkerOpen(markerCluster, {
            position: markerCluster.getLatLng(),
            items: clusterItems
          })
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
      map.off('moveend', hideClusteredRectangles)
      cluster.off('animationend', hideClusteredRectangles)
      cluster.off('clusterclick clusterkeypress', activateCluster as L.LeafletEventHandlerFn)
      pendingClusterRestores.forEach((restoreTimeout) => clearTimeout(restoreTimeout))
      if (activeTerminalMarker) {
        activeTerminalMarker.restored = true
        map.removeLayer(activeTerminalMarker.marker)
      }
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

  return (
    <>
      {datasetPopup && <DatasetPopupPortal {...datasetPopup} />}
      {terminalPopup && (
        <TerminalClusterPopup
          key={`${terminalPopup.position.lat},${terminalPopup.position.lng}:${terminalPopup.items
            .map(({ index }) => index)
            .join('|')}`}
          position={terminalPopup.position}
          items={terminalPopup.items}
          boundingBoxColor={boundingBoxColor}
          onClose={terminalPopup.onClose}
        />
      )}
    </>
  )
}

import type { TileLayerProps } from 'react-leaflet'
import type { ReactElement } from 'react'

/**
 * Represents a dataset with geographic information, for display on DatasetsMap.
 *
 * `bboxes` must contain at least one bounding box. An item either supplies `popupContent`, or
 * the remaining fields used to build the default popup content.
 */
export type DatasetBoundingBox = [[number, number], [number, number]]

interface GeoDatasetItemGeometry {
  bboxes: DatasetBoundingBox[]
}

export interface DefaultPopupDatasetItem extends GeoDatasetItemGeometry {
  popupContent?: never
  persistentId: string
  name: string
  detailsPageUrl: string
  authors: string
  publicationDate: string
}

export interface CustomPopupDatasetItem extends GeoDatasetItemGeometry {
  popupContent: ReactElement
}

export type GeoDatasetItem = DefaultPopupDatasetItem | CustomPopupDatasetItem

export interface DatasetMapColors {
  boundingBox?: string // bbox preview shown on pin hover
  pinPrimary?: string // fill color
  pinSecondary?: string // border and text color
  terminalPinPrimary?: string // fill color
  terminalPinSecondary?: string // border and text color
  clusterSmall?: string // <10 pin clusters use this
  clusterMedium?: string // <100 pins
  clusterLarge?: string // >=100 pins
  clusterPreview?: string // preview area shown on cluster hover
}

/** Overrides for the tile layer used by default. */
export type DatasetMapTileLayer = Partial<TileLayerProps>

/** Behavior of clusters that cannot be separated even at maximum zoom. */
export type TerminalClusterBehavior = 'carousel-popup' | 'spiderfy'

/** Determines whether datasets with multiple bounding boxes place one centered marker, or one per box. */
export type DatasetMarkerPlacement = 'bounding-box-centers' | 'dataset-center'

export interface CollectionMapData {
  items: GeoDatasetItem[]
  totalCount: number
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  isVisible: boolean
  mapHeight?: string | number //string: css value. number: pixels. defaults to 480px.
  tileLayer?: DatasetMapTileLayer
  colors?: DatasetMapColors
  terminalClusterBehavior?: TerminalClusterBehavior // defaults to carousel-popup
  markerPlacement?: DatasetMarkerPlacement // defaults to bounding-box-centers
}

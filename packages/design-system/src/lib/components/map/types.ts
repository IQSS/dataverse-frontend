/**
 * Represents a dataset with geographic information, for display on DatasetsMap.
 *
 * `pinLat`/`pinLon` determine where the marker is placed.
 * `bboxes` are bounding boxes shown on marker hover/click.
 * The remaining fields (`name`, `authors`, `publicationDate`, `detailsPageUrl`, `persistentId`)
 * are displayed in a popup that opens on marker click.
 */
export interface GeoDatasetItem {
  persistentId: string
  name: string
  detailsPageUrl: string
  authors: string
  publicationDate: string
  pinLat: number
  pinLon: number
  bboxes: [[number, number], [number, number]][]
}

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

/** Behavior of clusters that cannot be separated even at maximum zoom. */
export type TerminalClusterBehavior = 'carousel-popup' | 'spiderfy'

export interface CollectionMapData {
  items: GeoDatasetItem[]
  totalCount: number
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  isVisible: boolean
  mapHeight?: string | number //string: css value. number: pixels. defaults to 480px.
  colors?: DatasetMapColors
  terminalClusterBehavior?: TerminalClusterBehavior
}

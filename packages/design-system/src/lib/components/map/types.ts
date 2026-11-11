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

export interface CollectionMapData {
  items: GeoDatasetItem[]
  totalCount: number
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  isVisible: boolean
  mapHeight?: string | number //string: css value. number: pixels. defaults to 480px.
}

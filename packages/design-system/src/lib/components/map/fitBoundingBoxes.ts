import L from 'leaflet'
import { GeoDatasetItem } from './types'

export function fitBoundingBoxes(map: L.Map, bboxes: GeoDatasetItem['bboxes']): void {
  const bounds = L.latLngBounds(bboxes.flatMap(([southWest, northEast]) => [southWest, northEast]))
  map.fitBounds(bounds, { padding: [20, 20] })
}

import L from 'leaflet'

export const areaPreviewStyle = {
  weight: 2.5,
  opacity: 0.8,
  fillOpacity: 0.2
} as const

export function createBoundingBox(
  bounds: [[number, number], [number, number]],
  color: string
): L.Rectangle {
  return L.rectangle(bounds, {
    ...areaPreviewStyle,
    color,
    fillColor: color
  })
}

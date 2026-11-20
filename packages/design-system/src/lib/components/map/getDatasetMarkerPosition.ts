import { DatasetBoundingBox } from './types'

/** Places a dataset marker at the spherical mean of its bounding-box centers. */
export function getDatasetMarkerPosition(bboxes: DatasetBoundingBox[]): [number, number] {
  if (bboxes.length === 0) {
    throw new Error('A dataset map item must contain at least one bounding box.')
  }

  const degreesToRadians = Math.PI / 180
  const [x, y, z] = bboxes.reduce(
    ([x, y, z], [[south, west], [north, east]]) => {
      const latitude = ((south + north) / 2) * degreesToRadians
      const longitude = ((west + (east < west ? east + 360 : east)) / 2) * degreesToRadians
      const latitudeRadius = Math.cos(latitude)

      return [
        x + latitudeRadius * Math.cos(longitude),
        y + latitudeRadius * Math.sin(longitude),
        z + Math.sin(latitude)
      ]
    },
    [0, 0, 0]
  )

  return [Math.atan2(z, Math.hypot(x, y)) / degreesToRadians, Math.atan2(y, x) / degreesToRadians]
}

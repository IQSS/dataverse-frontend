import { getDatasetMarkerPosition } from '../../../src/lib/components/map/getDatasetMarkerPosition'

describe('getDatasetMarkerPosition', () => {
  it('places a marker at the center of a bounding box', () => {
    const [latitude, longitude] = getDatasetMarkerPosition([
      [
        [50, 6],
        [52, 10]
      ]
    ])

    expect(latitude).to.be.closeTo(51, 0.000001)
    expect(longitude).to.be.closeTo(8, 0.000001)
  })

  it('places an antimeridian-crossing bounding box near the antimeridian', () => {
    const [latitude, longitude] = getDatasetMarkerPosition([
      [
        [10, 170],
        [20, -170]
      ]
    ])

    expect(latitude).to.be.closeTo(15, 0.000001)
    expect(Math.abs(longitude)).to.be.closeTo(180, 0.000001)
  })

  it('accounts for Earth curvature when averaging bounding-box centers', () => {
    const [latitude, longitude] = getDatasetMarkerPosition([
      [
        [60, -45],
        [60, -45]
      ],
      [
        [60, 45],
        [60, 45]
      ]
    ])

    expect(latitude).to.be.closeTo(67.792346, 0.000001)
    expect(longitude).to.be.closeTo(0, 0.000001)
  })

  it('rejects an item without bounding boxes', () => {
    expect(() => getDatasetMarkerPosition([])).to.throw(
      'A dataset map item must contain at least one bounding box.'
    )
  })
})

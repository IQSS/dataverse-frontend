import L from 'leaflet'
import { isTerminalCluster } from '../../../src/lib/components/map/isTerminalCluster'

interface ClusterStub {
  _childClusters: ClusterStub[]
  _childCount: number
  _zoom: number
  _group: { _maxZoom: number }
}

function clusterStub(
  zoom: number,
  childCount: number,
  childClusters: ClusterStub[] = [],
  maxZoom = 19
): ClusterStub {
  return {
    _childClusters: childClusters,
    _childCount: childCount,
    _zoom: zoom,
    _group: { _maxZoom: maxZoom }
  }
}

describe('isTerminalCluster', () => {
  it('identifies a cluster whose complete child set remains clustered at maximum zoom', () => {
    const bottomCluster = clusterStub(19, 3)
    const middleCluster = clusterStub(12, 3, [bottomCluster])
    const visibleCluster = clusterStub(4, 3, [middleCluster])

    expect(isTerminalCluster(visibleCluster as unknown as L.MarkerCluster)).to.equal(true)
  })

  it('rejects a cluster whose hierarchy branches before maximum zoom', () => {
    const firstChild = clusterStub(12, 2)
    const secondChild = clusterStub(12, 2)
    const visibleCluster = clusterStub(4, 4, [firstChild, secondChild])

    expect(isTerminalCluster(visibleCluster as unknown as L.MarkerCluster)).to.equal(false)
  })

  it('rejects a cluster when only some children remain clustered at maximum zoom', () => {
    const bottomCluster = clusterStub(19, 2)
    const visibleCluster = clusterStub(4, 3, [bottomCluster])

    expect(isTerminalCluster(visibleCluster as unknown as L.MarkerCluster)).to.equal(false)
  })

  it('uses the clustering maximum rather than assuming the map maximum is 19', () => {
    const visibleCluster = clusterStub(17, 2, [], 17)

    expect(isTerminalCluster(visibleCluster as unknown as L.MarkerCluster)).to.equal(true)
  })
})

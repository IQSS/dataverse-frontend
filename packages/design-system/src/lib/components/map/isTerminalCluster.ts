import L from 'leaflet'

/**
 * The hierarchy fields used by leaflet.markercluster's own `_zoomOrSpiderfy`
 * decision. The plugin does not expose an equivalent public API.
 */
interface MarkerClusterInternals extends L.MarkerCluster {
  _childClusters: MarkerClusterInternals[]
  _childCount: number
  _zoom: number
  _group: {
    _maxZoom: number
  }
}

/**
 * Checks whether every marker in this cluster remains in one cluster at
 * the leaflet map's maximum zoom.
 */
export function isTerminalCluster(cluster: L.MarkerCluster): boolean {
  const currentCluster = cluster as MarkerClusterInternals
  let bottomCluster = currentCluster

  while (bottomCluster._childClusters.length === 1) {
    bottomCluster = bottomCluster._childClusters[0]
  }

  return (
    bottomCluster._zoom === currentCluster._group._maxZoom &&
    bottomCluster._childCount === currentCluster._childCount
  )
}

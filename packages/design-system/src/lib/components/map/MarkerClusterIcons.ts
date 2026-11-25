import L from 'leaflet'
import styles from './MarkerClusterGroup.module.scss'

export const markerPinPopupAnchor = L.point(0, -40)

export interface ResolvedPinColors {
  fill: string
  border: string
  text: string
}

interface ResolvedClusterColors {
  outer: string
  inner: string
}

export type ClusterSize = 'small' | 'medium' | 'large'

export function resolveClusterColors(color: string): ResolvedClusterColors {
  return {
    outer: `color-mix(in srgb, color-mix(in srgb, ${color} 65%, white) 60%, transparent)`,
    inner: `color-mix(in srgb, ${color} 60%, transparent)`
  }
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function createMarkerPinIcon(
  count: number,
  className: string,
  colors: ResolvedPinColors
): L.DivIcon {
  const fontSize = count < 100 ? 13 : count < 1000 ? 10 : 8
  const datasetLabel = count === 1 ? 'dataset' : 'datasets'
  const fill = escapeHtmlAttribute(colors.fill)
  const border = escapeHtmlAttribute(colors.border)
  const text = escapeHtmlAttribute(colors.text)

  return L.divIcon({
    html:
      `<svg viewBox="0 0 32 48" role="img" ` +
      `aria-label="${count} ${datasetLabel} at this location">` +
      `<path class="${styles['marker-pin-shape']}" fill="${fill}" stroke="${border}" ` +
      'd="M16 47L2.9 23.3A15 15 0 1 1 29.1 23.3Z" />' +
      `<text class="${styles['marker-pin-count']}" fill="${text}" x="16" y="17" ` +
      `font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${count}</text>` +
      '</svg>',
    className: `${className} ${styles['marker-pin-icon']}`,
    iconSize: L.point(32, 48),
    iconAnchor: L.point(16, 47),
    popupAnchor: markerPinPopupAnchor
  })
}

export function createClusterIcon(
  isTerminal: boolean,
  count: number,
  terminalPinColors: ResolvedPinColors,
  clusterColors: Record<ClusterSize, ResolvedClusterColors>
): L.DivIcon {
  if (isTerminal) {
    return createMarkerPinIcon(count, 'dataset-map-terminal-marker', terminalPinColors)
  }

  const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large'
  const palette = clusterColors[size]
  const outer = escapeHtmlAttribute(palette.outer)
  const inner = escapeHtmlAttribute(palette.inner)

  return L.divIcon({
    html:
      `<div class="${styles['cluster-outer']}" style="background-color:${outer}">` +
      `<div class="${styles['cluster-inner']}" style="background-color:${inner}">` +
      `<span>${count}</span></div></div>`,
    className: `dataset-map-cluster dataset-map-cluster-${size} ${styles['cluster-icon']}`,
    iconSize: L.point(40, 40)
  })
}

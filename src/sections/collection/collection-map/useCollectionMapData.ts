import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { Utils } from '@/shared/helpers/Utils'
import { GeoDatasetItem } from '@iqss/dataverse-design-system'

const PAGE_SIZE = 50

interface BboxValue {
  southLatitude?: { value: string }
  westLongitude?: { value: string }
  northLatitude?: { value: string }
  eastLongitude?: { value: string }
}

interface GeospatialField {
  typeName: string
  value: BboxValue[]
}

interface SearchItem {
  global_id?: string
  name?: string
  authors?: (string | { name?: string })[]
  author_name?: string
  published_at?: string
  metadataBlocks?: {
    geospatial?: {
      fields: GeospatialField[]
    }
  }
}

interface SearchResponse {
  data?: {
    total_count?: number
    items?: SearchItem[]
  }
}

function extractGeoItem(item: SearchItem): GeoDatasetItem | null {
  const fields = item.metadataBlocks?.geospatial?.fields
  if (!fields) return null

  const bboxField = fields.find((f) => f.typeName === 'geographicBoundingBox')
  if (!bboxField?.value?.length) return null

  const bboxes: [[number, number], [number, number]][] = []
  let latSum = 0
  let lonSum = 0

  for (const bbox of bboxField.value) {
    const south = parseFloat(bbox.southLatitude?.value ?? '')
    const west = parseFloat(bbox.westLongitude?.value ?? '')
    const north = parseFloat(bbox.northLatitude?.value ?? '')
    const east = parseFloat(bbox.eastLongitude?.value ?? '')
    if (isNaN(south) || isNaN(west) || isNaN(north) || isNaN(east)) continue
    bboxes.push([
      [south, west],
      [north, east]
    ])
    latSum += (south + north) / 2
    lonSum += (west + east) / 2
  }

  if (bboxes.length === 0) return null

  const authors = Array.isArray(item.authors)
    ? item.authors.map((a) => (typeof a === 'string' ? a : a.name ?? '')).join(', ')
    : item.author_name ?? ''

  return {
    persistentId: item.global_id ?? '',
    name: item.name ?? '',
    detailsPageUrl: `${window.location.origin}/dataset.xhtml?persistentId=${item.global_id ?? ''}`,
    authors,
    publicationDate: item.published_at?.substring(0, 10) ?? '',
    pinLat: latSum / bboxes.length,
    pinLon: lonSum / bboxes.length,
    bboxes: bboxes
  }
}

function buildSearchUrl(
  collectionId: string,
  start: number,
  searchText?: string,
  filterQueries?: FilterQuery[]
) {
  const params = new URLSearchParams()
  params.set('q', searchText && searchText.length > 0 ? searchText : '*')
  params.set('type', 'dataset')
  params.set('metadata_fields', 'geospatial:*')
  params.set('subtree', collectionId)
  params.set('start', String(start))
  params.set('per_page', String(PAGE_SIZE))
  params.append('fq', 'geolocation:*')
  for (const fq of filterQueries ?? []) {
    const idx = fq.indexOf(':')
    if (idx > 0) {
      const key = fq.slice(0, idx).trim()
      const value = fq.slice(idx + 1).trim()
      params.append('fq', `${key}:"${value}"`)
    } else {
      params.append('fq', fq)
    }
  }
  return `${window.location.origin}/api/search?${params.toString()}`
}

export function useCollectionMapData(
  collectionId: string,
  searchText?: string,
  filterQueries?: FilterQuery[]
) {
  const { t } = useTranslation('collection')
  const [items, setItems] = useState<GeoDatasetItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [start, setStart] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filterQueriesKey = filterQueries?.join('\0') ?? ''

  const fetchPage = useCallback(
    async (pageStart: number, replace: boolean, signal?: AbortSignal) => {
      setIsLoading(true)
      setError(null)
      try {
        const fqs = filterQueriesKey ? (filterQueriesKey.split('\0') as FilterQuery[]) : undefined
        const url = buildSearchUrl(collectionId, pageStart, searchText, fqs)
        const tokenKey = ApiConfig.bearerTokenLocalStorageKey
        const token = tokenKey ? Utils.getLocalStorageItem<string>(tokenKey) : null
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await fetch(url, { signal, headers })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = (await response.json()) as SearchResponse
        const total = json.data?.total_count ?? 0
        const geoItems = (json.data?.items ?? []).flatMap((item) => {
          const gi = extractGeoItem(item)
          return gi ? [gi] : []
        })
        setTotalCount(total)
        setItems((prev) => (replace ? geoItems : [...prev, ...geoItems]))
        setStart(pageStart + PAGE_SIZE)
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : t('map.failedToLoad'))
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [collectionId, searchText, filterQueriesKey, t]
  )

  useEffect(() => {
    const controller = new AbortController()
    setItems([])
    setStart(0)
    setTotalCount(0)
    void fetchPage(0, true, controller.signal)
    return () => controller.abort()
  }, [fetchPage])

  const loadMore = useCallback(() => {
    void fetchPage(start, false)
  }, [fetchPage, start])

  return {
    items,
    totalCount,
    isLoading,
    error,
    hasMore: items.length < totalCount,
    loadMore
  }
}

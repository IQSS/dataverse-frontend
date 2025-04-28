import { Route as RouteEnum } from '@/sections/Route.enum'
import { useMemo } from 'react'

import { matchRoutes, useLocation } from 'react-router-dom'

export const PAGE_OPTIONS = {
  HOME: 'Home',
  COLLECTION: 'Collection',
  CREATE_COLLECTION: 'Create Collection',
  EDIT_COLLECTION: 'Edit Collection Metadata',
  FEATURED_ITEM: 'Featured Item',
  EDIT_COLLECTION_FEATURED_ITEMS: 'Edit Collection Featured Items',
  DATASETS: 'Dataset',
  CREATE_DATASET: 'Create Dataset',
  EDIT_DATASET: 'Edit Dataset Metadata',
  UPLOAD_DATASET_FILES: 'Upload Dataset Files',
  FILES: 'File',
  FILES_REPLACE: 'Replace File',
  EDIT_FILE_METADATA: 'Edit File Metadata',
  ACCOUNT: 'Account'
}

const PAGE_OPTIONS_MAP = {
  [RouteEnum.HOME]: PAGE_OPTIONS.HOME,
  [RouteEnum.COLLECTIONS]: PAGE_OPTIONS.COLLECTION,
  [RouteEnum.COLLECTIONS_BASE]: PAGE_OPTIONS.COLLECTION,
  [RouteEnum.CREATE_COLLECTION]: PAGE_OPTIONS.CREATE_COLLECTION,
  [RouteEnum.EDIT_COLLECTION]: PAGE_OPTIONS.EDIT_COLLECTION,
  [RouteEnum.FEATURED_ITEM]: PAGE_OPTIONS.FEATURED_ITEM,
  [RouteEnum.EDIT_COLLECTION_FEATURED_ITEMS]: PAGE_OPTIONS.EDIT_COLLECTION_FEATURED_ITEMS,
  [RouteEnum.DATASETS]: PAGE_OPTIONS.DATASETS,
  [RouteEnum.CREATE_DATASET]: PAGE_OPTIONS.CREATE_DATASET,
  [RouteEnum.EDIT_DATASET_METADATA]: PAGE_OPTIONS.EDIT_DATASET,
  [RouteEnum.UPLOAD_DATASET_FILES]: PAGE_OPTIONS.UPLOAD_DATASET_FILES,
  [RouteEnum.FILES]: PAGE_OPTIONS.FILES,
  [RouteEnum.FILES_REPLACE]: PAGE_OPTIONS.FILES_REPLACE,
  [RouteEnum.EDIT_FILE_METADATA]: PAGE_OPTIONS.EDIT_FILE_METADATA,
  [RouteEnum.ACCOUNT]: PAGE_OPTIONS.ACCOUNT
}

const ROUTE_ENUM_TO_ARRAY = Object.values(RouteEnum).map((route) => ({ path: route }))

export const useGetDefaultPageOptionFromURL = (): string | undefined => {
  const location = useLocation()

  const matchingRoutes = matchRoutes(ROUTE_ENUM_TO_ARRAY, location.pathname)
  const matchingPath: RouteEnum | undefined = matchingRoutes?.[0]?.route.path

  const optionFound = useMemo(() => {
    if (matchingPath) {
      return PAGE_OPTIONS_MAP[matchingPath as keyof typeof PAGE_OPTIONS_MAP]
    }
    return undefined
  }, [matchingPath])

  return optionFound
}

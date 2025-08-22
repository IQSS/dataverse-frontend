import { ReplaceFileReferrer } from './replace-file/ReplaceFile'
import { EditFileMetadataReferrer } from '@/sections/edit-file-metadata/EditFileMetadata'

export enum Route {
  HOME = '/',
  SIGN_UP_JSF = '/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse.xhtml',
  LOG_IN_JSF = '/loginpage.xhtml?redirectPage=%2Fdataverse.xhtml',
  LOG_OUT = '/',
  DATASETS = '/datasets',
  CREATE_DATASET = '/datasets/:collectionId/create',
  UPLOAD_DATASET_FILES = '/datasets/upload-files',
  EDIT_DATASET_METADATA = '/datasets/edit-metadata',
  FILES = '/files',
  EDIT_FILE_METADATA = '/files/edit-metadata',
  FILES_REPLACE = '/files/replace',
  COLLECTIONS_BASE = '/collections',
  COLLECTIONS = '/collections/:collectionId',
  CREATE_COLLECTION = '/collections/:parentCollectionId/create',
  ACCOUNT = '/account',
  EDIT_COLLECTION = '/collections/:collectionId/edit',
  EDIT_FEATURED_ITEMS = '/collections/:collectionId/edit-featured-items',
  FEATURED_ITEM = '/featured-item/:parentCollectionId/:featuredItemId',
  NOT_FOUND_PAGE = '/404',
  AUTH_CALLBACK = '/auth-callback',
  SIGN_UP = '/sign-up',
  ADVANCED_SEARCH = '/collections/:collectionId/search'
}

export const RouteWithParams = {
  COLLECTIONS: (collectionId?: string) =>
    collectionId ? `/collections/${collectionId}` : Route.COLLECTIONS_BASE,
  CREATE_COLLECTION: (parentCollectionId: string) => `/collections/${parentCollectionId}/create`,
  CREATE_DATASET: (collectionId: string) => `/datasets/${collectionId}/create`,
  EDIT_COLLECTION: (collectionId: string) => `/collections/${collectionId}/edit`,
  EDIT_FEATURED_ITEMS: (collectionId: string) => `/collections/${collectionId}/edit-featured-items`,
  EDIT_FILE_METADATA: (
    datasetPersistentId: string,
    datasetVersion: string,
    fileId: number,
    referrer: EditFileMetadataReferrer
  ) => {
    const searchParams = new URLSearchParams({
      [QueryParamKey.FILE_ID]: fileId.toString(),
      [QueryParamKey.PERSISTENT_ID]: datasetPersistentId,
      [QueryParamKey.DATASET_VERSION]: datasetVersion,
      [QueryParamKey.REFERRER]: referrer
    })

    return `/files/edit-metadata?${searchParams.toString()}`
  },
  FILES_REPLACE: (
    datasetPersistentId: string,
    datasetVersion: string,
    fileId: number,
    referrer?: ReplaceFileReferrer
  ) => {
    const searchParams = new URLSearchParams({
      [QueryParamKey.FILE_ID]: fileId.toString(),
      [QueryParamKey.PERSISTENT_ID]: datasetPersistentId,
      [QueryParamKey.DATASET_VERSION]: datasetVersion
    })

    if (referrer) {
      searchParams.append(QueryParamKey.REFERRER, referrer)
    }

    return `/files/replace?${searchParams.toString()}`
  },
  FEATURED_ITEM: (parentCollectionId: string, featuredItemId: string) =>
    `/featured-item/${parentCollectionId}/${featuredItemId}`,
  ADVANCED_SEARCH: (collectionId: string) => `/collections/${collectionId}/search`
}

export enum QueryParamKey {
  VERSION = 'version',
  PERSISTENT_ID = 'persistentId',
  PAGE = 'page',
  COLLECTION_ID = 'collectionId',
  TAB = 'tab',
  FILE_ID = 'id',
  DATASET_VERSION = 'datasetVersion',
  REFERRER = 'referrer',
  AUTH_STATE = 'state',
  VALID_TOKEN_BUT_NOT_LINKED_ACCOUNT = 'validTokenButNotLinkedAccount'
}

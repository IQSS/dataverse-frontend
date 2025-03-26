export enum Route {
  HOME = '/',
  SIGN_UP = '/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse.xhtml',
  LOG_IN = '/loginpage.xhtml?redirectPage=%2Fdataverse.xhtml',
  LOG_OUT = '/',
  DATASETS = '/datasets',
  CREATE_DATASET = '/datasets/:collectionId/create',
  UPLOAD_DATASET_FILES = '/datasets/upload-files',
  EDIT_DATASET_METADATA = '/datasets/edit-metadata',
  FILES = '/files',
  FILES_REPLACE = '/files/replace',
  COLLECTIONS_BASE = '/collections',
  COLLECTIONS = '/collections/:collectionId',
  CREATE_COLLECTION = '/collections/:parentCollectionId/create',
  EDIT_COLLECTION = '/collections/:collectionId/edit',
  ACCOUNT = '/account',
  EDIT_COLLECTION_FEATURED_ITEMS = '/collections/:collectionId/edit-featured-items',
  FEATURED_ITEM = '/featured-item/:parentCollectionId/:featuredItemId'
}

export const RouteWithParams = {
  COLLECTIONS: (collectionId?: string) =>
    collectionId ? `/collections/${collectionId}` : Route.COLLECTIONS_BASE,
  CREATE_COLLECTION: (parentCollectionId: string) => `/collections/${parentCollectionId}/create`,
  CREATE_DATASET: (collectionId: string) => `/datasets/${collectionId}/create`,
  EDIT_COLLECTION: (collectionId: string) => `/collections/${collectionId}/edit`,
  EDIT_COLLECTION_FEATURED_ITEMS: (collectionId: string) =>
    `/collections/${collectionId}/edit-featured-items`,
  FILES_REPLACE: (datasetPersistentId: string, datasetVersion: string, fileId: number) => {
    const searchParams = new URLSearchParams({
      [QueryParamKey.FILE_ID]: fileId.toString(),
      [QueryParamKey.PERSISTENT_ID]: datasetPersistentId,
      [QueryParamKey.DATASET_VERSION]: datasetVersion
    })

    return `/files/replace?${searchParams.toString()}`
  },
  FEATURED_ITEM: (parentCollectionId: string, featuredItemId: string) =>
    `/featured-item/${parentCollectionId}/${featuredItemId}`
}

export enum QueryParamKey {
  VERSION = 'version',
  PERSISTENT_ID = 'persistentId',
  PAGE = 'page',
  COLLECTION_ID = 'collectionId',
  TAB = 'tab',
  FILE_ID = 'fileId',
  DATASET_VERSION = 'datasetVersion'
}

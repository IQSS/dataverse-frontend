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
  COLLECTIONS_BASE = '/collections',
  COLLECTIONS = '/collections/:collectionId',
  CREATE_COLLECTION = '/collections/:parentCollectionId/create',
  EDIT_COLLECTION = '/collections/:collectionId/edit',
  ACCOUNT = '/account',
  COLLECTION_FEATURED_ITEMS = '/collections/:collectionId/featured-items'
}

export const RouteWithParams = {
  COLLECTIONS: (collectionId?: string) =>
    collectionId ? `/collections/${collectionId}` : Route.COLLECTIONS_BASE,
  CREATE_COLLECTION: (parentCollectionId: string) => `/collections/${parentCollectionId}/create`,
  CREATE_DATASET: (collectionId: string) => `/datasets/${collectionId}/create`,
  EDIT_COLLECTION: (collectionId: string) => `/collections/${collectionId}/edit`,
  COLLECTION_FEATURED_ITEMS: (collectionId: string) => `/collections/${collectionId}/featured-items`
}

export enum QueryParamKey {
  VERSION = 'version',
  PERSISTENT_ID = 'persistentId',
  QUERY = 'q',
  COLLECTION_ITEM_TYPES = 'types',
  PAGE = 'page',
  COLLECTION_ID = 'collectionId'
}

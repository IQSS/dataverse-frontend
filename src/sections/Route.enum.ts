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
  CREATE_COLLECTION = '/collections/:ownerCollectionId/create',
  ACCOUNT = '/account'
}

export const RouteWithParams = {
  COLLECTIONS: (collectionId?: string) =>
    collectionId ? `/collections/${collectionId}` : Route.COLLECTIONS_BASE,
  CREATE_COLLECTION: (ownerCollectionId: string) => `/collections/${ownerCollectionId}/create`,
  CREATE_DATASET: (collectionId: string) => `/datasets/${collectionId}/create`
}

export enum QueryParamKey {
  VERSION = 'version',
  PERSISTENT_ID = 'persistentId',
  PAGE = 'page',
  COLLECTION_ID = 'collectionId'
}

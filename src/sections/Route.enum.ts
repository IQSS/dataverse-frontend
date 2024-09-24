import { ROOT_COLLECTION_ALIAS } from '../collection/domain/models/Collection'

export enum Route {
  HOME = '/',
  SIGN_UP = '/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse.xhtml',
  LOG_IN = '/oauth2/sign_in',
  LOG_OUT = '/oauth2/sign_out',
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
  COLLECTIONS: (collectionId?: string) => `/collections/${collectionId ?? 'root'}`,
  CREATE_COLLECTION: (ownerCollectionId?: string) =>
    `/collections/${ownerCollectionId ?? ROOT_COLLECTION_ALIAS}/create`,
  CREATE_DATASET: (collectionId?: string) =>
    `/datasets/${collectionId ?? ROOT_COLLECTION_ALIAS}/create`
}

export enum QueryParamKey {
  VERSION = 'version',
  PERSISTENT_ID = 'persistentId',
  QUERY = 'q'
}

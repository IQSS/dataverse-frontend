export enum Route {
  HOME = '/',
  SIGN_UP = '/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse.xhtml',
  LOG_IN = '/loginpage.xhtml?redirectPage=%2Fdataverse.xhtml',
  LOG_OUT = '/',
  DATASETS = '/datasets',
  CREATE_DATASET = '/datasets/create',
  UPLOAD_DATASET_FILES = '/datasets/upload-files',
  EDIT_DATASET_METADATA = '/datasets/edit-metadata',
  FILES = '/files',
  COLLECTIONS = '/collections/:collectionId',
  CREATE_COLLECTION = '/collections/:ownerCollectionId/create',
  USER_PANEL = '/user-panel'
}

export const RouteWithParams = {
  COLLECTIONS: (collectionId?: string) => `/collections/${collectionId ?? 'root'}`,
  CREATE_COLLECTION: (ownerCollectionId?: string) =>
    `/collections/${ownerCollectionId ?? 'root'}/create`
}

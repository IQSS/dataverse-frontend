export enum Route {
  HOME = '/',
  SIGN_UP = '/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse.xhtml',
  LOG_IN = '/loginpage.xhtml?redirectPage=%2Fdataverse.xhtml',
  LOG_OUT = '/',
  DATASETS = '/datasets',
  CREATE_DATASET = '/datasets/create',
  UPLOAD_DATASET_FILES = '/datasets/upload-files',
  FILES = '/files',
  COLLECTIONS = '/collections',
  NEW_COLLECTION = '/collections/new/:ownerCollectionId'
}

export const RouteWithParams = {
  NEW_COLLECTION: (ownerCollectionId?: string) => `/collections/new/${ownerCollectionId ?? 'root'}`
}

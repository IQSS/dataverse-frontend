import { RouteObject } from 'react-router-dom'
import { Route } from '../sections/Route.enum'
import { Layout } from '../sections/layout/Layout'
import { PageNotFound } from '../sections/page-not-found/PageNotFound'
import { DatasetFactory } from '../sections/dataset/DatasetFactory'
import { CreateDatasetFactory } from '../sections/create-dataset/CreateDatasetFactory'
import { FileFactory } from '../sections/file/FileFactory'
import { CollectionFactory } from '../sections/collection/CollectionFactory'
import { UploadDatasetFilesFactory } from '../sections/upload-dataset-files/UploadDatasetFilesFactory'
import { EditDatasetMetadataFactory } from '../sections/edit-dataset-metadata/EditDatasetMetadataFactory'
import { CreateCollectionFactory } from '../sections/create-collection/CreateCollectionFactory'
import { AccountFactory } from '../sections/account/AccountFactory'
import { ProtectedRoute } from './ProtectedRoute'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: Route.HOME,
        element: CollectionFactory.create()
      },
      {
        path: Route.COLLECTIONS_BASE,
        element: CollectionFactory.create()
      },
      {
        path: Route.COLLECTIONS,
        element: CollectionFactory.create()
      },
      {
        path: Route.DATASETS,
        element: DatasetFactory.create()
      },
      {
        path: Route.FILES,
        element: FileFactory.create()
      },
      // 🔐 Protected routes are only accessible to authenticated users
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: Route.CREATE_COLLECTION,
            element: CreateCollectionFactory.create()
          },
          {
            path: Route.CREATE_DATASET,
            element: CreateDatasetFactory.create()
          },
          {
            path: Route.UPLOAD_DATASET_FILES,
            element: UploadDatasetFilesFactory.create()
          },
          {
            path: Route.EDIT_DATASET_METADATA,
            element: EditDatasetMetadataFactory.create()
          },
          {
            path: Route.ACCOUNT,
            element: AccountFactory.create()
          }
        ]
      }
    ]
  }
]

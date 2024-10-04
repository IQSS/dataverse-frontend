import { RouteObject } from 'react-router-dom'
import { Route } from '../sections/Route.enum'
import { Layout } from '../sections/layout/Layout'
import { DatasetFactory } from '../sections/dataset/DatasetFactory'
import { CreateDatasetFactory } from '../sections/create-dataset/CreateDatasetFactory'
import { FileFactory } from '../sections/file/FileFactory'
import { CollectionFactory } from '../sections/collection/CollectionFactory'
import { UploadDatasetFilesFactory } from '../sections/upload-dataset-files/UploadDatasetFilesFactory'
import { EditDatasetMetadataFactory } from '../sections/edit-dataset-metadata/EditDatasetMetadataFactory'
import { CreateCollectionFactory } from '../sections/create-collection/CreateCollectionFactory'
import { AccountFactory } from '../sections/account/AccountFactory'
import { ProtectedRoute } from './ProtectedRoute'
import { HomepageFactory } from '../sections/homepage/HomepageFactory'
import { ErrorPage } from '../sections/error-page/ErrorPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: Route.HOME,
        element: HomepageFactory.create(),
        errorElement: <ErrorPage />
      },
      {
        path: Route.COLLECTIONS_BASE,
        element: CollectionFactory.create(),
        errorElement: <ErrorPage />
      },
      {
        path: Route.COLLECTIONS,
        element: CollectionFactory.create(),
        errorElement: <ErrorPage />
      },
      {
        path: Route.DATASETS,
        element: DatasetFactory.create(),
        errorElement: <ErrorPage />
      },
      {
        path: Route.FILES,
        element: FileFactory.create(),
        errorElement: <ErrorPage />
      },
      // 🔐 Protected routes are only accessible to authenticated users
      {
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: Route.CREATE_COLLECTION,
            element: CreateCollectionFactory.create(),
            errorElement: <ErrorPage />
          },
          {
            path: Route.CREATE_DATASET,
            element: CreateDatasetFactory.create(),
            errorElement: <ErrorPage />
          },
          {
            path: Route.UPLOAD_DATASET_FILES,
            element: UploadDatasetFilesFactory.create(),
            errorElement: <ErrorPage />
          },
          {
            path: Route.EDIT_DATASET_METADATA,
            element: EditDatasetMetadataFactory.create(),
            errorElement: <ErrorPage />
          },
          {
            path: Route.ACCOUNT,
            element: AccountFactory.create(),
            errorElement: <ErrorPage />
          }
        ]
      }
    ]
  }
]

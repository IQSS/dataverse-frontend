import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { Route } from '../sections/Route.enum'
import { Layout } from '../sections/layout/Layout'
import { PageNotFound } from '../sections/page-not-found/PageNotFound'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthCallback } from '../sections/auth-callback/AuthCallback'
import { AppLoader } from '../sections/shared/layout/app-loader/AppLoader'

const Homepage = lazy(() =>
  import('../sections/homepage/HomepageFactory').then(({ HomepageFactory }) => ({
    default: () => HomepageFactory.create()
  }))
)

const CollectionPage = lazy(() =>
  import('../sections/collection/CollectionFactory').then(({ CollectionFactory }) => ({
    default: () => CollectionFactory.create()
  }))
)

const DatasetPage = lazy(() =>
  import('../sections/dataset/DatasetFactory').then(({ DatasetFactory }) => ({
    default: () => DatasetFactory.create()
  }))
)

const FilePage = lazy(() =>
  import('../sections/file/FileFactory').then(({ FileFactory }) => ({
    default: () => FileFactory.create()
  }))
)

const CreateCollectionPage = lazy(() =>
  import('../sections/create-collection/CreateCollectionFactory').then(
    ({ CreateCollectionFactory }) => ({
      default: () => CreateCollectionFactory.create()
    })
  )
)

const CreateDatasetPage = lazy(() =>
  import('../sections/create-dataset/CreateDatasetFactory').then(({ CreateDatasetFactory }) => ({
    default: () => CreateDatasetFactory.create()
  }))
)

const UploadDatasetFilesPage = lazy(() =>
  import('../sections/upload-dataset-files/UploadDatasetFilesFactory').then(
    ({ UploadDatasetFilesFactory }) => ({
      default: () => UploadDatasetFilesFactory.create()
    })
  )
)

const EditDatasetMetadataPage = lazy(() =>
  import('../sections/edit-dataset-metadata/EditDatasetMetadataFactory').then(
    ({ EditDatasetMetadataFactory }) => ({
      default: () => EditDatasetMetadataFactory.create()
    })
  )
)

const AccountPage = lazy(() =>
  import('../sections/account/AccountFactory').then(({ AccountFactory }) => ({
    default: () => AccountFactory.create()
  }))
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: Route.HOME,
        element: (
          <Suspense fallback={<AppLoader />}>
            <Homepage />
          </Suspense>
        )
      },
      {
        path: Route.COLLECTIONS_BASE,
        element: (
          <Suspense fallback={<AppLoader />}>
            <CollectionPage />
          </Suspense>
        )
      },
      {
        path: Route.COLLECTIONS,
        element: (
          <Suspense fallback={<AppLoader />}>
            <CollectionPage />
          </Suspense>
        )
      },
      {
        path: Route.DATASETS,
        element: (
          <Suspense fallback={<AppLoader />}>
            <DatasetPage />
          </Suspense>
        )
      },
      {
        path: Route.FILES,
        element: (
          <Suspense fallback={<AppLoader />}>
            <FilePage />
          </Suspense>
        )
      },
      {
        path: Route.AUTH_CALLBACK,
        element: <AuthCallback />
      },
      // 🔐 Protected routes are only accessible to authenticated users
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: Route.CREATE_COLLECTION,
            element: (
              <Suspense fallback={<AppLoader />}>
                <CreateCollectionPage />
              </Suspense>
            )
          },
          {
            path: Route.CREATE_DATASET,
            element: (
              <Suspense fallback={<AppLoader />}>
                <CreateDatasetPage />
              </Suspense>
            )
          },
          {
            path: Route.UPLOAD_DATASET_FILES,
            element: (
              <Suspense fallback={<AppLoader />}>
                <UploadDatasetFilesPage />
              </Suspense>
            )
          },
          {
            path: Route.EDIT_DATASET_METADATA,
            element: (
              <Suspense fallback={<AppLoader />}>
                <EditDatasetMetadataPage />
              </Suspense>
            )
          },
          {
            path: Route.ACCOUNT,
            element: (
              <Suspense fallback={<AppLoader />}>
                <AccountPage />
              </Suspense>
            )
          }
        ]
      }
    ]
  }
]

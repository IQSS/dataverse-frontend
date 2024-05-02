import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetNonNumericVersion } from './dataset/domain/models/Dataset'
import { AppLoader } from './sections/shared/layout/AppLoader/AppLoader'
import { PageNotFound } from './sections/page-not-found/PageNotFound'

const DatasetPage = lazy(() =>
  import('./sections/dataset/DatasetFactory').then(({ DatasetFactory }) => ({
    default: () => DatasetFactory.create()
  }))
)

const CreateDatasetPage = lazy(() =>
  import('./sections/create-dataset/CreateDatasetFactory').then(({ CreateDatasetFactory }) => ({
    default: () => CreateDatasetFactory.create()
  }))
)

const FilePage = lazy(() =>
  import('./sections/file/FileFactory').then(({ FileFactory }) => ({
    default: () => FileFactory.create()
  }))
)

const CollectionPage = lazy(() =>
  import('./sections/collection/CollectionFactory').then(({ CollectionFactory }) => ({
    default: () => CollectionFactory.create()
  }))
)

const UploadDatasetFilesPage = lazy(() =>
  import('./sections/upload-dataset-files/UploadDatasetFilesFactory').then(
    ({ UploadDatasetFilesFactory }) => ({
      default: () => UploadDatasetFilesFactory.create()
    })
  )
)

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: Route.HOME,
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
          path: Route.FILES,
          element: (
            <Suspense fallback={<AppLoader />}>
              <FilePage />
            </Suspense>
          )
        }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)

export function searchParamVersionToDomainVersion(version?: string): string | undefined {
  if (version === 'DRAFT') {
    return DatasetNonNumericVersion.DRAFT.toString()
  }

  return version
}

export function Router() {
  return <RouterProvider router={router} />
}

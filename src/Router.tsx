import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetFactory } from './sections/dataset/DatasetFactory'
import { PageNotFound } from './sections/page-not-found/PageNotFound'
import { CreateDatasetFactory } from './sections/create-dataset/CreateDatasetFactory'
import { FileFactory } from './sections/file/FileFactory'
import { HomeFactory } from './sections/home/HomeFactory'
import { DatasetNonNumericVersion } from './dataset/domain/models/Dataset'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: Route.HOME,
          element: HomeFactory.create()
        },
        {
          path: Route.DATASETS,
          element: DatasetFactory.create()
        },
        {
          path: Route.CREATE_DATASET,
          element: CreateDatasetFactory.create()
        },
        {
          path: Route.FILES,
          element: FileFactory.create()
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

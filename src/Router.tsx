import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetFactory } from './sections/dataset/DatasetFactory'
import { PageNotFound } from './sections/page-not-found/PageNotFound'
import { CreateDatasetFactory } from './sections/create-dataset/CreateDatasetFactory'
import { HomeFactory } from './sections/home/HomeFactory'

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
          path: `${Route.DATASETS}`,
          element: DatasetFactory.create()
        },
        {
          path: `${Route.CREATE}`,
          element: CreateDatasetFactory.create()
        }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)

export function Router() {
  return <RouterProvider router={router} />
}

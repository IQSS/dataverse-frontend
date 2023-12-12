import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelloDataverse } from './sections/hello-dataverse/HelloDataverse'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetFactory } from './sections/dataset/DatasetFactory'
import { PageNotFound } from './sections/page-not-found/PageNotFound'
import CreateDatasetContainer from './views/create-dataset/CreateDatasetContainer'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: Route.HOME,
          element: <HelloDataverse />
        },
        {
          path: `${Route.DATASETS}`,
          element: DatasetFactory.create()
        },
        {
          path: `${Route.DATASETS}/${Route.CREATE}`,
          element: <CreateDatasetContainer />
        }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)

export function Router() {
  return <RouterProvider router={router} />
}

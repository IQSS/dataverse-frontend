import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom'
import { HelloDataverse } from './sections/hello-dataverse/HelloDataverse'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetFactory } from './sections/dataset/DatasetFactory'
import { PageNotFound } from './sections/page-not-found/PageNotFound'
import { CreateDataset } from './views/create-dataset/CreateDataset'

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
          path: `${Route.CREATE}`,
          element: <CreateDataset />
        }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)

// Just a quick test for ensuring errorElements work correctly.
function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>
}

export function Router() {
  return <RouterProvider router={router} />
}

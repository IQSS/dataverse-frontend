import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelloDataverse } from './sections/hello-dataverse/HelloDataverse'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/route.enum'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: Route.HOME,
          element: <HelloDataverse />
        }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)

export function Router() {
  return <RouterProvider router={router} />
}

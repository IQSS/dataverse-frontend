import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelloDataverse } from './sections/hello-dataverse/HelloDataverse'
import { Layout } from './sections/layout/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HelloDataverse />
      }
    ]
  }
])

export function Router() {
  return <RouterProvider router={router} />
}

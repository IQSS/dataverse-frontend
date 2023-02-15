import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelloDataverse } from './sections/hello-dataverse/HelloDataverse'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HelloDataverse />
  }
])

export function Router() {
  return <RouterProvider router={router} />
}

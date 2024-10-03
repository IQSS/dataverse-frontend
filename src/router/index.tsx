import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DatasetNonNumericVersion } from '../dataset/domain/models/Dataset'
import { routes } from './routes'

const browserRouter = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

export function Router() {
  return <RouterProvider router={browserRouter} />
}

export function searchParamVersionToDomainVersion(version?: string): string | undefined {
  if (version === 'DRAFT') {
    return DatasetNonNumericVersion.DRAFT.toString()
  }

  return version
}

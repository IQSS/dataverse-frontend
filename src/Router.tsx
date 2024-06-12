import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './sections/layout/Layout'
import { Route } from './sections/Route.enum'
import { DatasetFactory } from './sections/dataset/DatasetFactory'
import { PageNotFound } from './sections/page-not-found/PageNotFound'
import { CreateDatasetFactory } from './sections/create-dataset/CreateDatasetFactory'
import { FileFactory } from './sections/file/FileFactory'
import { CollectionFactory } from './sections/collection/CollectionFactory'
import { UploadDatasetFilesFactory } from './sections/upload-dataset-files/UploadDatasetFilesFactory'
import { EditDatasetMetadataFactory } from './sections/edit-dataset-metadata/EditDatasetMetadataFactory'
import { DatasetNonNumericVersion } from './dataset/domain/models/Dataset'

// TODO: Implement scroll restoration on navigation

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: Route.HOME,
          element: CollectionFactory.create()
        },
        {
          path: Route.COLLECTIONS,
          element: CollectionFactory.create()
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
          path: Route.UPLOAD_DATASET_FILES,
          element: UploadDatasetFilesFactory.create()
        },
        {
          path: Route.EDIT_DATASET_METADATA,
          element: EditDatasetMetadataFactory.create()
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

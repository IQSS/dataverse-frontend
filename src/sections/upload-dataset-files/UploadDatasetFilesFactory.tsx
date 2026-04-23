import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { UploadDatasetFiles } from './UploadDatasetFiles'
import { searchParamVersionToDomainVersion } from '../../router'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

export class UploadDatasetFilesFactory {
  static create(): ReactElement {
    return <UploadDatasetFilesWithSearchParams />
  }
}

function UploadDatasetFilesWithSearchParams() {
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const searchParamVersion = searchParams.get('version') ?? undefined
  const version = searchParamVersionToDomainVersion(searchParamVersion)

  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: persistentId, version: version }}>
        <UploadDatasetFiles fileRepository={fileRepository} />
      </DatasetProvider>
    </RepositoriesProvider>
  )
}

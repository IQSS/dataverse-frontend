import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { UploadDatasetFiles } from './UploadDatasetFiles'
import { searchParamVersionToDomainVersion } from '../../router'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()

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
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}>
      <UploadDatasetFiles fileRepository={fileRepository} />
    </DatasetProvider>
  )
}

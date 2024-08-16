import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { UploadDatasetFiles } from './UploadDatasetFiles'
import { DatasetNonNumericVersion } from '../../dataset/domain/models/Dataset'

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
  const version = searchParams.get('version') ?? DatasetNonNumericVersion.DRAFT

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}>
      <UploadDatasetFiles fileRepository={fileRepository} />
    </DatasetProvider>
  )
}

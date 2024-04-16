import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { EditDatasetFiles } from './EditDatasetFiles'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()

export class EditDatasetFilesFactory {
  static create(): ReactElement {
    return <EditDatasetFilesWithSearchParams />
  }
}

function EditDatasetFilesWithSearchParams() {
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined

  return (
    <DatasetProvider repository={datasetRepository} searchParams={{ persistentId: persistentId }}>
      <EditDatasetFiles fileRepository={fileRepository} />
    </DatasetProvider>
  )
}

import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EditDatasetMetadata } from './EditDatasetMetadata'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { searchParamVersionToDomainVersion } from '../../router'

const datasetRepository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class EditDatasetMetadataFactory {
  static create(): ReactElement {
    return <EditDatasetMetadataWithParams />
  }
}

function EditDatasetMetadataWithParams() {
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const searchParamVersion = searchParams.get('version') ?? undefined
  const version = searchParamVersionToDomainVersion(searchParamVersion)
  const keepRawFields = true

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version, keepRawFields: keepRawFields }}>
      <EditDatasetMetadata
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    </DatasetProvider>
  )
}

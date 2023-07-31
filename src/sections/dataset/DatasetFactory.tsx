import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { MetadataBlockInfoProvider } from './metadata-block-info/MetadataBlockProvider'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/MetadataBlockInfoJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <MetadataBlockInfoProvider repository={metadataBlockInfoRepository}>
        <AnonymizedProvider>
          <DatasetWithSearchParams />
        </AnonymizedProvider>
      </MetadataBlockInfoProvider>
    )
  }
}

function DatasetWithSearchParams() {
  const { setAnonymizedView } = useAnonymized()
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const privateUrlToken = searchParams.get('privateUrlToken')
  const version = searchParams.get('version') ?? undefined

  useEffect(() => {
    if (privateUrlToken) setAnonymizedView(true)
  }, [privateUrlToken])

  if (privateUrlToken) {
    return (
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        searchParams={{ privateUrlToken: privateUrlToken }}
      />
    )
  }

  return (
    <Dataset
      datasetRepository={datasetRepository}
      fileRepository={fileRepository}
      searchParams={{ persistentId: persistentId, version: version }}
    />
  )
}

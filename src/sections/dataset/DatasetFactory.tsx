import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { MetadataBlockInfoProvider } from './metadata-block-info/MetadataBlockProvider'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/MetadataBlockInfoJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
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
      <Dataset repository={datasetRepository} searchParams={{ privateUrlToken: privateUrlToken }} />
    )
  }

  return (
    <Dataset
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}
    />
  )
}

import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <AnonymizedProvider>
        <DatasetWithSearchParams />
      </AnonymizedProvider>
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

import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'

const datasetRepository = new DatasetJSDataverseRepository()

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

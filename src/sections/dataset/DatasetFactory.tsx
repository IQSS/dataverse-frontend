import { ReactElement } from 'react'
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
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId')
  const privateUrlToken = searchParams.get('privateUrlToken')

  if (privateUrlToken) {
    const { setAnonymizedView } = useAnonymized()
    setAnonymizedView(true)

    return (
      <Dataset repository={datasetRepository} searchParams={{ privateUrlToken: privateUrlToken }} />
    )
  }

  if (persistentId) {
    return <Dataset repository={datasetRepository} searchParams={{ persistentId: persistentId }} />
  }

  return <Dataset repository={datasetRepository} searchParams={{ persistentId: undefined }} />
}

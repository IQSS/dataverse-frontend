import { ReactElement } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { AnonymizedContext } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'

const datasetRepository = new DatasetJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <AnonymizedProvider>
        <DatasetWithId />
      </AnonymizedProvider>
    )
  }

  static createAnonymized(): ReactElement {
    return (
      <AnonymizedProvider>
        <AnonymizedContext.Consumer>
          {({ setAnonymizedView }) => {
            setAnonymizedView(true)
            return <DatasetWithPrivateUrlToken />
          }}
        </AnonymizedContext.Consumer>
      </AnonymizedProvider>
    )
  }
}

function DatasetWithId() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (id === undefined) {
    navigate('/')
    return <></>
  }

  return <Dataset repository={datasetRepository} searchParams={{ id: id }} />
}

function DatasetWithPrivateUrlToken() {
  const [searchParams] = useSearchParams()
  const privateUrlToken = searchParams.get('privateUrlToken')

  return (
    <Dataset repository={datasetRepository} searchParams={{ privateUrlToken: privateUrlToken }} />
  )
}

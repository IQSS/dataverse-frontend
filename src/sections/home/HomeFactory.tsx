import { ReactElement } from 'react'
import { Home } from './Home'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useSearchParams } from 'react-router-dom'

const datasetRepository = new DatasetJSDataverseRepository()
export class HomeFactory {
  static create(): ReactElement {
    return <HomeWithSearchParams />
  }
}

function HomeWithSearchParams() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : undefined

  return <Home datasetRepository={datasetRepository} page={page} />
}

import { ReactElement } from 'react'
import { Home } from './Home'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
export class HomeFactory {
  static create(): ReactElement {
    return <Home datasetRepository={datasetRepository} />
  }
}

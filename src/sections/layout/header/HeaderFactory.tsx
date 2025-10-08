import { ReactElement } from 'react'
import { Header } from './Header'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return (
      <Header collectionRepository={collectionRepository} datasetRepository={datasetRepository} />
    )
  }
}

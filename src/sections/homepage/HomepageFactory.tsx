import { ReactElement } from 'react'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import Homepage from './Homepage'

const collectionRepository = new CollectionJSDataverseRepository()

export class HomepageFactory {
  static create(): ReactElement {
    return <Homepage collectionRepository={collectionRepository} />
  }
}

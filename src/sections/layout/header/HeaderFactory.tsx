import { ReactElement } from 'react'
import { Header } from './Header'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return <Header collectionRepository={collectionRepository} />
  }
}

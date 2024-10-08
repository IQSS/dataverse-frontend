import { ReactElement } from 'react'
import { CollectionFeaturedItems } from './CollectionFeaturedItems'

export class CollectionFeaturedItemsFactory {
  static create(): ReactElement {
    return <CollectionFeaturedItems />
  }
}

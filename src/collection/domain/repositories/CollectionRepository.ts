import { Collection } from '../models/Collection'

export interface CollectionRepository {
  getById: (id: string) => Promise<Collection | undefined>
}

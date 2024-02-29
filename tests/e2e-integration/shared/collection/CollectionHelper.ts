import { DataverseApiHelper } from '../DataverseApiHelper'
import newCollectionData from '../../fixtures/new-collection-data.json'

export interface CollectionResponse {
  id: string
}

interface CollectionPayload {
  alias: string
}

export class CollectionHelper extends DataverseApiHelper {
  static async create(id = 'subcollection'): Promise<CollectionResponse> {
    const collection: CollectionPayload | undefined = await this.request<CollectionPayload>(
      `/dataverses/${id}`,
      'GET'
    ).catch(() => undefined)
    if (collection) {
      return { id: collection.alias }
    }

    const newCollection: CollectionPayload = await this.request<CollectionPayload>(
      `/dataverses/root`,
      'POST',
      {
        ...newCollectionData,
        alias: id
      }
    )
    return { id: newCollection.alias }
  }
}

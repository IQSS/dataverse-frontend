import { DataverseApiHelper } from '../DataverseApiHelper'
import newCollectionData from '../../fixtures/new-collection-data.json'

export interface CollectionResponse {
  id: string
  isReleased: boolean
}

interface CollectionPayload {
  alias: string
  isReleased: boolean
}

export class CollectionHelper extends DataverseApiHelper {
  static async create(id = 'subcollection'): Promise<CollectionResponse> {
    const collection: CollectionPayload | undefined = await this.request<CollectionPayload>(
      `/dataverses/${id}`,
      'GET'
    ).catch(() => undefined)
    if (collection) {
      return { id: collection.alias, isReleased: collection.isReleased }
    }

    const newCollection: CollectionPayload = await this.request<CollectionPayload>(
      `/dataverses/root`,
      'POST',
      {
        ...newCollectionData,
        alias: id
      }
    )
    return { id: newCollection.alias, isReleased: newCollection.isReleased }
  }
  static async publish(id: string): Promise<{
    status: string
    id: string
  }> {
    const response = await this.request<{
      status: string
    }>(`/dataverses/${id}/actions/:publish`, 'POST')

    return { ...response, id }
  }
  static async createAndPublish(id = 'subcollection'): Promise<CollectionResponse> {
    const collectionResponse = await CollectionHelper.create(id)
    console.log(collectionResponse)
    if (!collectionResponse.isReleased) {
      await CollectionHelper.publish(collectionResponse.id)
    }
    return collectionResponse
  }
}

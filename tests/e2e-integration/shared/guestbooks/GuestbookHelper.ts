import { DataverseApiHelper } from '../DataverseApiHelper'
import { ROOT_COLLECTION_ALIAS } from '../collection/ROOT_COLLECTION_ALIAS'

interface GuestbookResponse {
  id: number
  name: string
}

const defaultGuestbookPayload = {
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  email: '',
  institution: '',
  position: '',
  customQuestions: []
}

export class GuestbookHelper extends DataverseApiHelper {
  static async create(
    name: string,
    collectionIdOrAlias: string = ROOT_COLLECTION_ALIAS
  ): Promise<void> {
    await this.request(
      `/guestbooks/${collectionIdOrAlias}`,
      'POST',
      {
        ...defaultGuestbookPayload,
        name
      },
      'application/json'
    )
  }

  static async getByCollectionId(
    collectionIdOrAlias: string = ROOT_COLLECTION_ALIAS
  ): Promise<GuestbookResponse[]> {
    return this.request<GuestbookResponse[]>(`/guestbooks/${collectionIdOrAlias}/list`, 'GET')
  }

  static async createAndGetByName(
    name: string,
    collectionIdOrAlias: string = ROOT_COLLECTION_ALIAS
  ): Promise<GuestbookResponse> {
    await this.create(name, collectionIdOrAlias)
    const guestbooks = await this.getByCollectionId(collectionIdOrAlias)
    const createdGuestbook = guestbooks.find((guestbook) => guestbook.name === name)

    if (!createdGuestbook) {
      throw new Error(`Guestbook "${name}" was not found after creation`)
    }

    return createdGuestbook
  }

  static async assignToDataset(datasetId: number, guestbookId: number): Promise<void> {
    await this.request(`/datasets/${datasetId}/guestbook`, 'PUT', `${guestbookId}`, 'text/plain')
  }
}

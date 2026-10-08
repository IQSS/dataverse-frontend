import { type CreateGuestbookDTO } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookResponseSubset } from '@/guestbooks/domain/models/GuestbookResponse'

export const storybookGuestbook: Guestbook = {
  id: 3,
  name: 'Storybook Guestbook',
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 1,
      type: 'text',
      hidden: false
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 1,
  usageCount: 7,
  responseCount: 3
}

export class GuestbookMockRepository implements GuestbookRepository {
  createGuestbook(_collectionIdOrAlias: number | string, _guestbook: CreateGuestbookDTO) {
    return Promise.resolve(storybookGuestbook.id)
  }

  getGuestbook(_guestbookId: number): Promise<Guestbook> {
    return Promise.resolve(storybookGuestbook)
  }

  getGuestbooksByCollectionId(
    _collectionIdOrAlias: number | string,
    _includeStats?: boolean,
    _includeInherited?: boolean
  ): Promise<Guestbook[]> {
    return Promise.resolve([storybookGuestbook])
  }

  setGuestbookEnabled(
    _collectionIdOrAlias: number | string,
    _guestbookId: number,
    _enabled: boolean
  ): Promise<void> {
    return Promise.resolve()
  }

  getGuestbookResponsesByGuestbookId(
    _guestbookId: number,
    _limit?: number,
    _offset?: number
  ): Promise<GuestbookResponseSubset> {
    return Promise.resolve({
      guestbookResponses: [],
      totalGuestbookResponseCount: 0
    })
  }

  downloadGuestbookResponsesByCollectionId(_collectionIdOrAlias: number | string): Promise<string> {
    return Promise.resolve('name,email\nJane Doe,jane@example.com')
  }

  downloadGuestbookResponsesByGuestbookId(
    _dataverseId: number | string,
    _guestbookId: number
  ): Promise<string> {
    return Promise.resolve('name,email\nJane Doe,jane@example.com')
  }

  assignDatasetGuestbook(_datasetId: number | string, _guestbookId: number): Promise<void> {
    return Promise.resolve()
  }

  removeDatasetGuestbook(_datasetId: number | string): Promise<void> {
    return Promise.resolve()
  }
}

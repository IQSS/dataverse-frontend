import {
  type CreateGuestbookDTO,
  type Guestbook as JSDataverseGuestbook
} from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'

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

export const storybookClientGuestbooks: JSDataverseGuestbook[] = [
  {
    id: storybookGuestbook.id,
    name: storybookGuestbook.name,
    enabled: storybookGuestbook.enabled,
    nameRequired: storybookGuestbook.nameRequired,
    emailRequired: storybookGuestbook.emailRequired,
    institutionRequired: storybookGuestbook.institutionRequired,
    positionRequired: storybookGuestbook.positionRequired,
    createTime: storybookGuestbook.createTime,
    dataverseId: storybookGuestbook.dataverseId,
    customQuestions: storybookGuestbook.customQuestions
  }
]

export class GuestbookMockRepository implements GuestbookRepository {
  createGuestbook(_collectionIdOrAlias: number | string, _guestbook: CreateGuestbookDTO) {
    return Promise.resolve(storybookGuestbook.id)
  }

  getGuestbook(_guestbookId: number): Promise<Guestbook> {
    return Promise.resolve(storybookGuestbook)
  }

  getGuestbooksByCollectionId(
    _collectionIdOrAlias: number | string,
    _includeStats?: boolean
  ): Promise<Guestbook[]> {
    return Promise.resolve(storybookClientGuestbooks as Guestbook[])
  }

  setGuestbookEnabled(
    _collectionIdOrAlias: number | string,
    _guestbookId: number,
    _enabled: boolean
  ): Promise<void> {
    return Promise.resolve()
  }

  downloadGuestbookResponsesByDataverseId(_dataverseId: number | string): Promise<string> {
    return Promise.resolve('name,email\nJane Doe,jane@example.com')
  }

  downloadGuestbookResponsesOfAGuestbook(
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

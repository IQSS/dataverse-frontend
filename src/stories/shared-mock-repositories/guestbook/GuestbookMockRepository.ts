import { type Guestbook as JSDataverseGuestbook } from '@iqss/dataverse-client-javascript'
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
  dataverseId: 1
}

export const storybookClientGuestbooks: JSDataverseGuestbook[] = [
  {
    id: storybookGuestbook.id,
    name: storybookGuestbook.name,
    enabled: storybookGuestbook.enabled,
    email: '',
    institution: '',
    position: '',
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
  getGuestbook(_guestbookId: number): Promise<Guestbook> {
    return Promise.resolve(storybookGuestbook)
  }

  getGuestbooksByCollectionId(_collectionIdOrAlias: number | string): Promise<Guestbook[]> {
    return Promise.resolve(storybookClientGuestbooks as Guestbook[])
  }

  assignDatasetGuestbook(_datasetId: number | string, _guestbookId: number): Promise<void> {
    return Promise.resolve()
  }

  removeDatasetGuestbook(_datasetId: number | string): Promise<void> {
    return Promise.resolve()
  }
}

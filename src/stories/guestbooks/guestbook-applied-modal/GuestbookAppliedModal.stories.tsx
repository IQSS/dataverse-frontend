import { Meta, StoryObj } from '@storybook/react'
import { GuestbookAppliedModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/GuestbookAppliedModal'
import { WithI18next } from '@/stories/WithI18next'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'

class GuestbookMockRepository implements GuestbookRepository {
  getGuestbook(_guestbookId: number): Promise<Guestbook> {
    return Promise.resolve({
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
    })
  }
}

class AccessMockRepository implements AccessRepository {
  submitGuestbookForDatafileDownload(_fileId: number | string): Promise<string> {
    return Promise.resolve('/api/v1/access/datafile/123?token=storybook')
  }

  submitGuestbookForDatafilesDownload(_fileIds: Array<number | string>): Promise<string> {
    return Promise.resolve('/api/v1/access/datafiles/123,124?token=storybook')
  }
}

const meta: Meta<typeof GuestbookAppliedModal> = {
  title: 'Sections/Guestbooks/GuestbookAppliedModal',
  component: GuestbookAppliedModal,
  decorators: [
    WithI18next,
    WithLoggedInUser,
    (Story) => (
      <DatasetContext.Provider
        value={{
          dataset: DatasetMother.createRealistic({ guestbookId: 3 }),
          isLoading: false,
          refreshDataset: () => {}
        }}>
        <Story />
      </DatasetContext.Provider>
    )
  ]
}

export default meta
type Story = StoryObj<typeof GuestbookAppliedModal>

export const SingleFile: Story = {
  args: {
    show: true,
    handleClose: () => {},
    fileId: 123,
    guestbookId: 3,
    guestbookRepository: new GuestbookMockRepository(),
    accessRepository: new AccessMockRepository()
  }
}

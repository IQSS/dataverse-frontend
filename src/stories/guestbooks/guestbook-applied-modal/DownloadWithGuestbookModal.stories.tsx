import { Meta, StoryObj } from '@storybook/react'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import { WithI18next } from '@/stories/WithI18next'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'

const storybookGuestbook: Guestbook = {
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

const accessRepository: AccessRepository = {
  submitGuestbookForDatasetDownload: (
    _datasetId: number | string,
    _answers: Array<{ id: number | string; value: string | string[] }>
  ) => Promise.resolve('/api/v1/access/dataset/:persistentId?token=storybook'),
  submitGuestbookForDatafileDownload: (
    _fileId: number | string,
    _answers: Array<{ id: number | string; value: string | string[] }>
  ) => Promise.resolve('/api/v1/access/datafile/123?token=storybook'),
  submitGuestbookForDatafilesDownload: (
    _fileIds: Array<number | string>,
    _answers: Array<{ id: number | string; value: string | string[] }>
  ) => Promise.resolve('/api/v1/access/datafiles/123,124?token=storybook')
}

const guestbookRepository: GuestbookRepository = {
  getGuestbook: (_guestbookId: number) => Promise.resolve(storybookGuestbook)
}

const meta: Meta<typeof DownloadWithGuestbookModal> = {
  title: 'Sections/Guestbooks/DownloadWithGuestbookModal',
  component: DownloadWithGuestbookModal,
  decorators: [
    WithI18next,
    WithLoggedInUser,
    (Story) => (
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <AccessRepositoryProvider repository={accessRepository}>
          <DatasetContext.Provider
            value={{
              dataset: DatasetMother.createRealistic({ guestbookId: 3 }),
              isLoading: false,
              refreshDataset: () => {}
            }}>
            <Story />
          </DatasetContext.Provider>
        </AccessRepositoryProvider>
      </GuestbookRepositoryProvider>
    )
  ]
}

export default meta
type Story = StoryObj<typeof DownloadWithGuestbookModal>

export const SingleFile: Story = {
  args: {
    show: true,
    handleClose: () => {},
    fileId: 123,
    guestbookId: 3
  }
}

export const MultipleFiles: Story = {
  args: {
    show: true,
    handleClose: () => {},
    fileIds: [123, 124],
    guestbookId: 3
  }
}

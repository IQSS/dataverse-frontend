import { Meta, StoryObj } from '@storybook/react'
import { DownloadWithTermsAndGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithTermsAndGuestbookModal'
import { WithI18next } from '@/stories/WithI18next'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { GuestbookMockRepository } from '@/stories/shared-mock-repositories/guestbook/GuestbookMockRepository'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  AccessRepository,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'

const accessRepository: AccessRepository = {
  submitGuestbookForDatasetDownload: (
    _datasetId: number | string,
    _answers: GuestbookResponseDTO
  ) => Promise.resolve('/api/v1/access/dataset/:persistentId?token=storybook'),
  submitGuestbookForDatafileDownload: (_fileId: number | string, _answers: GuestbookResponseDTO) =>
    Promise.resolve('/api/v1/access/datafile/123?token=storybook'),
  submitGuestbookForDatafilesDownload: (_fileIds: Array<number>, _answers: GuestbookResponseDTO) =>
    Promise.resolve('/api/v1/access/datafiles/123,124?token=storybook')
}

const guestbookRepository = new GuestbookMockRepository()

const meta: Meta<typeof DownloadWithTermsAndGuestbookModal> = {
  title: 'Sections/Guestbooks/DownloadWithTermsAndGuestbookModal',
  component: DownloadWithTermsAndGuestbookModal,
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
type Story = StoryObj<typeof DownloadWithTermsAndGuestbookModal>

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

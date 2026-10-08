import { Meta, StoryObj } from '@storybook/react'
import { DatasetGuestbook } from '@/sections/dataset/dataset-guestbook/DatasetGuestbook'
import { WithI18next } from '@/stories/WithI18next'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  GuestbookMockRepository,
  storybookGuestbook
} from '@/stories/shared-mock-repositories/guestbook/GuestbookMockRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof DatasetGuestbook> = {
  title: 'Sections/Dataset Page/DatasetTerms/DatasetGuestbook',
  component: DatasetGuestbook,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetGuestbook>

const guestbookRepository = new GuestbookMockRepository()

const withDatasetContext = (datasetWithGuestbook: boolean) => {
  const DatasetGuestbookStoryDecorator = (StoryComponent: () => JSX.Element) => (
    <RepositoriesStoryProvider guestbookRepository={guestbookRepository}>
      <DatasetContext.Provider
        value={{
          dataset: DatasetMother.createRealistic({
            guestbookId: datasetWithGuestbook ? storybookGuestbook.id : undefined
          }),
          isLoading: false,
          refreshDataset: () => {}
        }}>
        <StoryComponent />
      </DatasetContext.Provider>
    </RepositoriesStoryProvider>
  )

  DatasetGuestbookStoryDecorator.displayName = `DatasetGuestbookStoryDecorator-${String(
    datasetWithGuestbook
  )}`
  return DatasetGuestbookStoryDecorator
}

export const WithAssignedGuestbook: Story = {
  decorators: [withDatasetContext(true)],
  render: () => <DatasetGuestbook />
}

export const WithoutAssignedGuestbook: Story = {
  decorators: [withDatasetContext(false)],
  render: () => <DatasetGuestbook />
}

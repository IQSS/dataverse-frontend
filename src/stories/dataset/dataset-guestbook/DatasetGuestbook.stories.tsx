import { Meta, StoryObj } from '@storybook/react'
import { DatasetGuestbook } from '@/sections/dataset/dataset-guestbook/DatasetGuestbook'
import { WithI18next } from '@/stories/WithI18next'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'

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

  assignDatasetGuestbook(_datasetId: number | string, _guestbookId: number): Promise<void> {
    return Promise.resolve()
  }

  removeDatasetGuestbook(_datasetId: number | string): Promise<void> {
    return Promise.resolve()
  }
}

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
    <GuestbookRepositoryProvider repository={guestbookRepository}>
      <DatasetContext.Provider
        value={{
          dataset: DatasetMother.createRealistic({
            guestbookId: datasetWithGuestbook ? 3 : undefined
          }),
          isLoading: false,
          refreshDataset: () => {}
        }}>
        <StoryComponent />
      </DatasetContext.Provider>
    </GuestbookRepositoryProvider>
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

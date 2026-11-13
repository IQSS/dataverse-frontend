import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { DatasetCurationStatusHistoryModal } from '@/sections/dataset/dataset-curation-status/DatasetCurationStatusHistoryModal'
import { WithI18next } from '@/stories/WithI18next'
import { WithRepositories } from '@/stories/WithRepositories'
import { CurationStoryRepository } from './CurationStoryRepository'

const loadingRepository = new CurationStoryRepository()
loadingRepository.getCurationStatusHistory = () => new Promise(() => {})
const errorRepository = new CurationStoryRepository()
errorRepository.getCurationStatusHistory = () => Promise.reject(new Error('Service unavailable'))
const meta: Meta<typeof DatasetCurationStatusHistoryModal> = {
  tags: ['curation-workflow'],
  title: 'Sections/Dataset Page/CurationStatusHistoryModal',
  component: DatasetCurationStatusHistoryModal,
  decorators: [WithI18next],
  args: { show: true, datasetId: 'doi:10.5072/FK2/STORY', handleClose: fn() }
}
export default meta
type Story = StoryObj<typeof DatasetCurationStatusHistoryModal>
export const WithHistory: Story = {
  decorators: [WithRepositories({ datasetRepository: new CurationStoryRepository() })]
}
export const Empty: Story = {
  decorators: [WithRepositories({ datasetRepository: new CurationStoryRepository(null) })]
}
export const Loading: Story = {
  decorators: [WithRepositories({ datasetRepository: loadingRepository })]
}
export const LoadError: Story = {
  decorators: [WithRepositories({ datasetRepository: errorRepository })]
}

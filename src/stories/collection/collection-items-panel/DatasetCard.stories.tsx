import { Meta, StoryObj } from '@storybook/react'
import { DatasetCard } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCard'
import { WithI18next } from '../../WithI18next'
import { DatasetPreviewMother } from '../../../../tests/component/dataset/domain/models/DatasetPreviewMother'

const meta: Meta<typeof DatasetCard> = {
  title: 'Sections/Collection Page/DatasetCard',
  component: DatasetCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCard>

export const Default: Story = {
  render: () => <DatasetCard datasetPreview={DatasetPreviewMother.createDraft()} />
}

export const Deaccessioned: Story = {
  render: () => <DatasetCard datasetPreview={DatasetPreviewMother.createDeaccessioned()} />
}

export const WithThumbnail: Story = {
  render: () => <DatasetCard datasetPreview={DatasetPreviewMother.createWithThumbnail()} />
}

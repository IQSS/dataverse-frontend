import { Meta, StoryObj } from '@storybook/react'
import { DatasetCard } from '@/sections/shared/collection-items-panel/items-list/dataset-card/DatasetCard'
import { WithI18next } from '../../WithI18next'
import { DatasetItemTypePreviewMother } from '../../../../tests/component/dataset/domain/models/DatasetItemTypePreviewMother'

const meta: Meta<typeof DatasetCard> = {
  title: 'Sections/Collection Page/DatasetCard',
  component: DatasetCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCard>

export const Default: Story = {
  render: () => <DatasetCard datasetPreview={DatasetItemTypePreviewMother.createDraft()} />
}

export const Deaccessioned: Story = {
  render: () => <DatasetCard datasetPreview={DatasetItemTypePreviewMother.createDeaccessioned()} />
}

export const WithThumbnail: Story = {
  render: () => <DatasetCard datasetPreview={DatasetItemTypePreviewMother.createWithThumbnail()} />
}

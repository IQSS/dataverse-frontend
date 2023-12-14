import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetCard } from '../../../sections/home/datasets-list/dataset-card/DatasetCard'
import { DatasetPreviewMother } from '../../../../tests/component/dataset/domain/models/DatasetPreviewMother'

const meta: Meta<typeof DatasetCard> = {
  title: 'Sections/Home/DatasetCard',
  component: DatasetCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCard>

export const Default: Story = {
  render: () => <DatasetCard dataset={DatasetPreviewMother.createDraft()} />
}

export const Deaccessioned: Story = {
  render: () => <DatasetCard dataset={DatasetPreviewMother.createDeaccessioned()} />
}

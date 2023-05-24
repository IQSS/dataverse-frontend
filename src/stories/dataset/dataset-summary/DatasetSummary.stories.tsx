import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetSummary } from '../../../sections/dataset/dataset-summary/DatasetSummary'
import { DatasetMetadataBlock, License } from '../../../dataset/domain/models/Dataset'
import { DatasetMockData } from '../DatasetMockData'

const meta: Meta<typeof DatasetSummary> = {
  title: 'Sections/Dataset Page/DatasetSummary',
  component: DatasetSummary,
  decorators: [WithI18next]
}

const licenseMock: License = DatasetMockData().license
const summaryFieldsMock: DatasetMetadataBlock[] = DatasetMockData().summaryFields

export default meta
type Story = StoryObj<typeof DatasetSummary>

export const Default: Story = {
  render: () => <DatasetSummary summaryFields={summaryFieldsMock} license={licenseMock} />
}

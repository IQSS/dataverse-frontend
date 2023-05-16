import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { DatasetMockData } from '../DatasetMockData'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const metadataBlocks: DatasetMetadataBlock[] = DatasetMockData().metadataBlocks

export const Default: Story = {
  render: () => <DatasetMetadata metadataBlocks={metadataBlocks} />
}

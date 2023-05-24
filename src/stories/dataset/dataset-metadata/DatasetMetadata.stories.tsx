import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { DatasetMockData } from '../DatasetMockData'
import { WithAnonymizedView } from '../WithAnonymizedView'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const metadataBlocksMock: DatasetMetadataBlock[] = DatasetMockData().metadataBlocks
const metadataBlocksAnonymizedMock: DatasetMetadataBlock[] = DatasetMockData(
  {},
  true
).metadataBlocks

export const Default: Story = {
  render: () => <DatasetMetadata metadataBlocks={metadataBlocksMock} />
}

export const AnonymizedView: Story = {
  decorators: [WithAnonymizedView],
  render: () => <DatasetMetadata metadataBlocks={metadataBlocksAnonymizedMock} />
}

import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { DatasetMockData } from '../DatasetMockData'
import { WithAnonymizedView } from '../WithAnonymizedView'
import { WithCitationMetadataBlockInfo } from '../WithCitationMetadataBlockInfo'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next, WithCitationMetadataBlockInfo]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const datasetMock = DatasetMockData()
const datasetMockAnonymized = DatasetMockData({}, true)

export const Default: Story = {
  render: () => (
    <DatasetMetadata
      persistentId={datasetMock.persistentId}
      metadataBlocks={datasetMock.metadataBlocks}
    />
  )
}

export const AnonymizedView: Story = {
  decorators: [WithAnonymizedView],
  render: () => (
    <DatasetMetadata
      persistentId={datasetMockAnonymized.persistentId}
      metadataBlocks={datasetMockAnonymized.metadataBlocks}
    />
  )
}

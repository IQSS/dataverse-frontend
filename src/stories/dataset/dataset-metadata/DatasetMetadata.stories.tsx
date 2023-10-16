import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { WithAnonymizedView } from '../WithAnonymizedView'
import { WithCitationMetadataBlockInfo } from '../WithCitationMetadataBlockInfo'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next, WithCitationMetadataBlockInfo]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const datasetMock = DatasetMother.createRealistic()
const datasetMockAnonymized = DatasetMother.createRealisticAnonymized()

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

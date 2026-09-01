import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { WithAnonymizedView } from '../WithAnonymizedView'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { MetadataBlockInfoMockRepository } from '../../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const datasetMock = DatasetMother.createRealistic()
const datasetMockAnonymized = DatasetMother.createRealisticAnonymized()

export const Default: Story = {
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetMockRepository()}>
      <DatasetMetadata
        dataset={datasetMock}
        anonymizedView={false}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
      />
    </RepositoriesStoryProvider>
  )
}

export const AnonymizedView: Story = {
  decorators: [WithAnonymizedView],
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetMockRepository()}>
      <DatasetMetadata
        dataset={datasetMockAnonymized}
        anonymizedView
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
      />
    </RepositoriesStoryProvider>
  )
}

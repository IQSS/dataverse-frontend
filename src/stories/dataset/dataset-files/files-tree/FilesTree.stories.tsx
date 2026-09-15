import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { FilesTree } from '../../../../sections/dataset/dataset-files/files-tree/FilesTree'
import { DatasetMother } from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { FileTreeMockRepository } from './FileTreeMockRepository'

const meta: Meta<typeof FilesTree> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTree',
  component: FilesTree,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FilesTree>

const testDataset = DatasetMother.createRealistic()

export const Default: Story = {
  render: () => (
    <FilesTree
      treeRepository={new FileTreeMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const PreExpanded: Story = {
  render: () => (
    <FilesTree
      treeRepository={new FileTreeMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
      initialPath="data/raw/2024"
    />
  )
}

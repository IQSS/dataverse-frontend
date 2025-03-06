import { Meta, StoryObj } from '@storybook/react'
import { DeaccessionDatasetModal } from '../../../sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'

const meta: Meta<typeof DeaccessionDatasetModal> = {
  title: 'Sections/Dataset Page/DeaccessionDatasetModal',
  component: DeaccessionDatasetModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof DeaccessionDatasetModal>

export const Default: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <DeaccessionDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      persistentId={'test'}
      versionList={[
        { id: 1, contributors: 'contributors', versionNumber: '1.0', publishedOn: '2023-01-01' },
        { id: 2, contributors: 'contributors', versionNumber: '1.1', publishedOn: '2023-02-01' }
      ]}
      handleClose={() => {}}></DeaccessionDatasetModal>
  )
}

export const WithOneVersion: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <DeaccessionDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      persistentId={'test'}
      versionList={[
        { id: 1, contributors: 'contributors', versionNumber: '1.0', publishedOn: '2023-01-01' }
      ]}
      handleClose={() => {}}></DeaccessionDatasetModal>
  )
}

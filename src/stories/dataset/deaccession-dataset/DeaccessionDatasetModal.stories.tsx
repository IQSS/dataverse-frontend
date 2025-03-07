import { Meta, StoryObj } from '@storybook/react'
import { DeaccessionDatasetModal } from '../../../sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { Control } from 'react-hook-form'
import { DeaccessionFormData } from '@/sections/dataset/deaccession-dataset/DeaccessionFormData'

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
      handleSubmitForm={() => {}}
      handleClose={() => {}}
      control={{} as Control<DeaccessionFormData>}
      errors={{}}
      publishedVersions={[
        { id: 1, contributors: 'contributors', versionNumber: '1.0', publishedOn: '2023-01-01' },
        { id: 2, contributors: 'contributors', versionNumber: '1.1', publishedOn: '2023-02-01' }
      ]}></DeaccessionDatasetModal>
  )
}

export const WithOneVersion: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <DeaccessionDatasetModal
      show={true}
      handleSubmitForm={() => {}}
      handleClose={() => {}}
      control={{} as Control<DeaccessionFormData>}
      errors={{}}
      publishedVersions={[
        { id: 1, contributors: 'contributors', versionNumber: '1.0', publishedOn: '2023-01-01' }
      ]}></DeaccessionDatasetModal>
  )
}

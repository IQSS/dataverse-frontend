import { Meta, StoryObj } from '@storybook/react'
import { DeaccessionDatasetModal } from '../../../sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DeaccessionFormData } from '@/sections/dataset/deaccession-dataset/DeaccessionFormData'
import { useForm } from 'react-hook-form'

const meta: Meta<typeof DeaccessionDatasetModal> = {
  title: 'Sections/Dataset Page/Deaccession Dataset/DeaccessionDatasetModal',
  component: DeaccessionDatasetModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof DeaccessionDatasetModal>

export const Default: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useForm<DeaccessionFormData>({
      defaultValues: {
        deaccessionReason: '',
        versions: ['1.0']
      }
    })
    return (
      <DeaccessionDatasetModal
        show={true}
        handleSubmitForm={() => {}}
        handleClose={() => {}}
        control={control}
        errors={{}}
        publishedVersions={[
          {
            id: 1,
            contributors: 'contributors',
            versionNumber: '1.0',
            publishedOn: '2023-01-01',
            summary: {}
          },
          {
            id: 2,
            contributors: 'contributors',
            versionNumber: '1.1',
            publishedOn: '2023-02-01',
            summary: {}
          }
        ]}
      />
    )
  }
}

export const WithOneVersion: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useForm<DeaccessionFormData>({
      defaultValues: {
        deaccessionReason: '',
        versions: ['1.0']
      }
    })
    return (
      <DeaccessionDatasetModal
        show={true}
        handleSubmitForm={() => {}}
        handleClose={() => {}}
        control={control}
        errors={{}}
        publishedVersions={[
          { id: 1, contributors: 'contributors', versionNumber: '1.0', publishedOn: '2023-01-01' }
        ]}></DeaccessionDatasetModal>
    )
  }
}

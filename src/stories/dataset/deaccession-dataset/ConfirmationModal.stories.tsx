import { Meta, StoryObj } from '@storybook/react'
import { ConfirmationModal } from '@/sections/dataset/deaccession-dataset/ConfirmationModal'
import { SubmissionStatus } from '@/sections/shared/form/DatasetMetadataForm/useSubmitDataset'
import { WithI18next } from '@/stories/WithI18next'

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Sections/Dataset Page/Deaccession Dataset/ConfirmationModal',
  component: ConfirmationModal,
  decorators: [WithI18next]
}
export default meta

type Story = StoryObj<typeof ConfirmationModal>
export const Default: Story = {
  render: () => (
    <ConfirmationModal
      show={true}
      submissionStatus={SubmissionStatus.IsSubmitting}
      isDeaccessioning={false}
      deaccessionError={null}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

export const WithLoading: Story = {
  render: () => (
    <ConfirmationModal
      show={true}
      submissionStatus={SubmissionStatus.IsSubmitting}
      isDeaccessioning={true}
      deaccessionError={null}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <ConfirmationModal
      show={true}
      submissionStatus={SubmissionStatus.Errored}
      isDeaccessioning={false}
      deaccessionError={'Error message'}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

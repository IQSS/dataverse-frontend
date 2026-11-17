import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { SubmitForReviewModal } from '@/sections/dataset/dataset-action-buttons/submit-for-review-button/SubmitForReviewModal'
import { WithI18next } from '@/stories/WithI18next'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof SubmitForReviewModal> = {
  tags: ['curation-workflow'],
  title: 'Sections/Dataset Page/SubmitForReviewModal',
  component: SubmitForReviewModal,
  decorators: [WithI18next],
  args: {
    show: true,
    handleClose: fn(),
    handleSubmit: fn(),
    handleCustomTermsClick: fn(),
    license: DatasetMother.create().license,
    isSubmitting: false,
    errorSubmitting: null
  }
}
export default meta
type Story = StoryObj<typeof SubmitForReviewModal>
export const Default: Story = {}
export const CustomTerms: Story = { args: { license: undefined } }
export const Submitting: Story = { args: { isSubmitting: true } }
export const Error: Story = {
  args: { errorSubmitting: 'Unable to submit this dataset for review. Please try again.' }
}

import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { SubmitForReviewButton } from '../../../../sections/dataset/dataset-action-buttons/submit-for-review-button/SubmitForReviewButton'

const meta: Meta<typeof SubmitForReviewButton> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/SubmitForReviewButton',
  component: SubmitForReviewButton,
  decorators: [WithI18next, WithSettings],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof SubmitForReviewButton>

export const CanSubmitForReview: Story = {
  render: () => (
    <SubmitForReviewButton
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersion(),
        permissions: DatasetPermissionsMother.create({
          canUpdateDataset: true,
          canPublishDataset: false
        }),
        locks: [],
        hasValidTermsOfAccess: true,
        isValid: true
      })}
    />
  )
}

export const AlreadySubmittedForReview: Story = {
  render: () => (
    <SubmitForReviewButton
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersionInReview(),
        permissions: DatasetPermissionsMother.create({
          canUpdateDataset: true,
          canPublishDataset: false
        }),
        locks: [DatasetLockMother.createLockedInReview()]
      })}
    />
  )
}

export const NoValidTermsOfAccess: Story = {
  render: () => (
    <SubmitForReviewButton
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersion(),
        permissions: DatasetPermissionsMother.create({
          canUpdateDataset: true,
          canPublishDataset: false
        }),
        locks: [],
        hasValidTermsOfAccess: false,
        isValid: true
      })}
    />
  )
}

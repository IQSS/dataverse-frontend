import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '@/stories/WithI18next'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { WithToasts } from '@/stories/WithToasts'
import { ContactMockRepository } from '@/stories/shared/contact/ContactMockRepository'
import { SpaUserFeedbackModal } from '@/sections/layout/spa-user-feedback-cta/spa-user-feedback-modal/SpaUserFeedbackModal'
import { ContactMockErrorRepository } from '@/stories/shared/contact/ContactMockErrorRepository'

const meta: Meta<typeof SpaUserFeedbackModal> = {
  title: 'Layout/Spa User Feedback Modal',
  component: SpaUserFeedbackModal,
  decorators: [WithI18next, WithLoggedInUser, WithToasts],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof SpaUserFeedbackModal>

export const Default: Story = {
  render: () => (
    <SpaUserFeedbackModal
      contactRepository={new ContactMockRepository()}
      userEmail="dataverse@mailinator.com"
      handleClose={() => {}}
      showModal
    />
  )
}

export const WhenFailing: Story = {
  render: () => (
    <SpaUserFeedbackModal
      contactRepository={new ContactMockErrorRepository()}
      userEmail="dataverse@mailinator.com"
      handleClose={() => {}}
      showModal
    />
  )
}

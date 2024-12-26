import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

const meta: Meta<typeof SocialShareModal> = {
  title: 'Sections/Shared/SocialShareModal',
  component: SocialShareModal,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof SocialShareModal>

export const Default: Story = {
  render: () => (
    <SocialShareModal
      shareUrl="https://example.com"
      show
      title="Share"
      helpText="Share this page with your friends"
      handleClose={() => {}}
    />
  )
}

export const ShareCollection: Story = {
  render: () => (
    <SocialShareModal
      shareUrl="https://example.com/some-collection"
      show
      title="Share Collection"
      helpText="Share this collection on your favorite social media networks."
      handleClose={() => {}}
    />
  )
}

export const ShareDataset: Story = {
  render: () => (
    <SocialShareModal
      shareUrl="https://example.com/some-dataset"
      show
      title="Share Dataset"
      helpText="Share this dataset on your favorite social media networks."
      handleClose={() => {}}
    />
  )
}

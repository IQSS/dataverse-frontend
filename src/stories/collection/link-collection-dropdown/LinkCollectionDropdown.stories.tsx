import { LinkCollectionDropdown } from '@/sections/collection/link-collection-dropdown/LinkCollectionDropdown'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { CollectionMockRepository } from '../CollectionMockRepository'

const meta: Meta<typeof LinkCollectionDropdown> = {
  title: 'Sections/Collection Page/LinkCollectionDropdown',
  component: LinkCollectionDropdown,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof LinkCollectionDropdown>

export const Default: Story = {
  render: () => (
    <LinkCollectionDropdown
      collectionId="1"
      collectionName="Collection Name"
      collectionRepository={new CollectionMockRepository()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link' })
    userEvent.click(dropdownBtn)
  }
}

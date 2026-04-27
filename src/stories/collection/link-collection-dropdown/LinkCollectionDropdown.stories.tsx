import { LinkCollectionDropdown } from '@/sections/collection/link-collection-dropdown/LinkCollectionDropdown'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { WithToasts } from '@/stories/WithToasts'
import { WithRepositories } from '@/stories/WithRepositories'

const meta: Meta<typeof LinkCollectionDropdown> = {
  title: 'Sections/Collection Page/LinkCollectionDropdown',
  component: LinkCollectionDropdown,
  decorators: [WithI18next, WithToasts],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof LinkCollectionDropdown>

export const Default: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => <LinkCollectionDropdown collectionId="1" collectionName="Collection Mock" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link' })
    userEvent.click(dropdownBtn)
  }
}

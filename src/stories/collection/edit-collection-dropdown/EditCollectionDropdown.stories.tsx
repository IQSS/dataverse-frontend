import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { EditCollectionDropdown } from '@/sections/collection/edit-collection-dropdown/EditCollectionDropdown'
import { WithRepositories } from '@/stories/WithRepositories'

const meta: Meta<typeof EditCollectionDropdown> = {
  title: 'Sections/Collection Page/EditCollectionDropdown',
  component: EditCollectionDropdown,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditCollectionDropdown>

export const Default: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <EditCollectionDropdown
      collection={CollectionMother.createComplete()}
      canUserDeleteCollection={false}
    />
  )
}

export const WithDeleteCollectionButton: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <EditCollectionDropdown
      collection={CollectionMother.createSubCollectionWithNoChildObjects()}
      canUserDeleteCollection={true}
    />
  )
}

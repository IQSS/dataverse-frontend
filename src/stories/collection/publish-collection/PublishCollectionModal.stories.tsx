import { Meta, StoryObj } from '@storybook/react'
import { PublishCollectionModal } from '../../../sections/collection/publish-collection/PublishCollectionModal'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'

const meta: Meta<typeof PublishCollectionModal> = {
  title: 'Sections/Collection Page/PublishCollectionModal',
  component: PublishCollectionModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof PublishCollectionModal>

export const Default: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <PublishCollectionModal
      show={true}
      repository={new CollectionMockRepository()}
      collectionId={'testAlias'}
      handleClose={() => {}}
      refetchCollection={() => {}}
    />
  )
}

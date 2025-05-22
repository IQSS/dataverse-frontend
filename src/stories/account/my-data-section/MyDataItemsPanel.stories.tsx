import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '@/stories/WithI18next'
import { MyDataItemsPanel } from '@/sections/account/my-data-section/MyDataItemsPanel'
import { CollectionMockRepository } from '../../collection/CollectionMockRepository'
import { WithLoggedInSuperUser } from '@/stories/WithLoggedInSuperUser'

const meta: Meta<typeof MyDataItemsPanel> = {
  title: 'Sections/Account Page/MyDataItemsPanel',
  component: MyDataItemsPanel,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof MyDataItemsPanel>

export const Default: Story = {
  render: () => <MyDataItemsPanel collectionRepository={new CollectionMockRepository()} />
}

export const WithSuperUser: Story = {
  decorators: [WithLoggedInSuperUser],
  render: () => <MyDataItemsPanel collectionRepository={new CollectionMockRepository()} />
}

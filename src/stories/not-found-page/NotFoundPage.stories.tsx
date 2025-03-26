import { Meta, StoryObj } from '@storybook/react'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { WithI18next } from '../WithI18next'

const meta: Meta<typeof NotFoundPage> = {
  title: 'Pages/Not Found Page',
  component: NotFoundPage,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof NotFoundPage>

export const Default: Story = {
  render: () => <NotFoundPage />
}

export const CollectionNotFound: Story = {
  render: () => <NotFoundPage dvObjectNotFoundType="collection" />
}

export const DatasetNotFound: Story = {
  render: () => <NotFoundPage dvObjectNotFoundType="dataset" />
}

export const FileNotFound: Story = {
  render: () => <NotFoundPage dvObjectNotFoundType="file" />
}

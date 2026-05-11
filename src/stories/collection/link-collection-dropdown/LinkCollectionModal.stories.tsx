import { LinkCollectionDropdown } from '@/sections/collection/link-collection-dropdown/LinkCollectionDropdown'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { CollectionSummaryMother } from '@tests/component/collection/domain/models/CollectionSummaryMother'
import { CollectionErrorMockRepository } from '../CollectionErrorMockRepository'
import { WithToasts } from '@/stories/WithToasts'
import { WithRepositories } from '@/stories/WithRepositories'

const meta: Meta<typeof LinkCollectionDropdown> = {
  title: 'Sections/Collection Page/LinkCollectionDropdown/LinkCollectionModal',
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

    const linkCollectionBtn = await canvas.findByRole('button', { name: 'Link Collection' })
    userEvent.click(linkCollectionBtn)
  }
}

const collectionRepoWithOnlyOneCollectionToLink = new CollectionMockRepository()
collectionRepoWithOnlyOneCollectionToLink.getForLinking = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([CollectionSummaryMother.create()])
    }, FakerHelper.loadingTimout())
  })
}

export const WithOnlyOneCollectionToLink: Story = {
  decorators: [
    WithRepositories({ collectionRepository: collectionRepoWithOnlyOneCollectionToLink })
  ],
  render: () => <LinkCollectionDropdown collectionId="1" collectionName="Collection Mock" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link' })
    userEvent.click(dropdownBtn)

    const linkCollectionBtn = await canvas.findByRole('button', { name: 'Link Collection' })
    userEvent.click(linkCollectionBtn)
  }
}

const collectionRepoWithNoCollectionsToLink = new CollectionMockRepository()
collectionRepoWithNoCollectionsToLink.getForLinking = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, FakerHelper.loadingTimout())
  })
}

export const WithNoCollectionsToLink: Story = {
  decorators: [WithRepositories({ collectionRepository: collectionRepoWithNoCollectionsToLink })],
  render: () => <LinkCollectionDropdown collectionId="1" collectionName="Collection Mock" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link' })
    userEvent.click(dropdownBtn)

    const linkCollectionBtn = await canvas.findByRole('button', { name: 'Link Collection' })
    userEvent.click(linkCollectionBtn)
  }
}

export const WithError: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionErrorMockRepository() })],
  render: () => <LinkCollectionDropdown collectionId="1" collectionName="Collection Mock" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link' })
    userEvent.click(dropdownBtn)

    const linkCollectionBtn = await canvas.findByRole('button', { name: 'Link Collection' })
    userEvent.click(linkCollectionBtn)
  }
}

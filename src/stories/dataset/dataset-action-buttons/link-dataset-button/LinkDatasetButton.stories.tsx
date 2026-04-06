import { Meta, StoryObj } from '@storybook/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { LinkDatasetButton } from '../../../../sections/dataset/dataset-action-buttons/link-and-unlink-actions/link-dataset-button/LinkDatasetButton'
import { DatasetMockRepository } from '../../DatasetMockRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { WithToasts } from '@/stories/WithToasts'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof LinkDatasetButton> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/LinkDatasetButton',
  component: LinkDatasetButton,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithToasts],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof LinkDatasetButton>

const withNoLinkedCollectionsDatasetRepo = new DatasetMockRepository()
withNoLinkedCollectionsDatasetRepo.getDatasetLinkedCollections = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, FakerHelper.loadingTimout())
  })
}

export const Default: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <LinkDatasetButton
        dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
        datasetRepository={withNoLinkedCollectionsDatasetRepo}
        updateParent={() => {}}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link Dataset' })
    userEvent.click(dropdownBtn)
  }
}

export const WithLinkedCollections: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <LinkDatasetButton
        dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
        datasetRepository={new DatasetMockRepository()}
        updateParent={() => {}}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link Dataset' })
    userEvent.click(dropdownBtn)
  }
}

const withOnlyOneCollectionToLinkRepo = new CollectionMockRepository()
withOnlyOneCollectionToLinkRepo.getForLinking = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 2,
          alias: 'only-collection-to-link',
          displayName: 'Only Collection to Link'
        }
      ])
    }, FakerHelper.loadingTimout())
  })
}

export const WithOnlyOneCollectionToLink: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={withOnlyOneCollectionToLinkRepo}>
      <LinkDatasetButton
        dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
        datasetRepository={withNoLinkedCollectionsDatasetRepo}
        updateParent={() => {}}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link Dataset' })
    userEvent.click(dropdownBtn)
  }
}

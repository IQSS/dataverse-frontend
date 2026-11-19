import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { PublishDatasetMenu } from '../../../../sections/dataset/dataset-action-buttons/publish-dataset-menu/PublishDatasetMenu'
import { WithLoggedInUser } from '../../../WithLoggedInUser'
import { DatasetMockRepository } from '../../DatasetMockRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof PublishDatasetMenu> = {
  tags: ['curation-workflow'],
  title: 'Sections/Dataset Page/DatasetActionButtons/PublishDatasetMenu',
  component: PublishDatasetMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof PublishDatasetMenu>

export const PublishingAllowed: Story = {
  render: () => (
    <RepositoriesStoryProvider
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}>
      <PublishDatasetMenu
        dataset={DatasetMother.create({
          version: DatasetVersionMother.createDraftAsLatestVersion(),
          permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
          locks: [],
          hasValidTermsOfAccess: true,
          isValid: true
        })}
      />
    </RepositoriesStoryProvider>
  )
}

export const NoValidTermsOfAccess: Story = {
  render: () => (
    <RepositoriesStoryProvider
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}>
      <PublishDatasetMenu
        dataset={DatasetMother.create({
          version: DatasetVersionMother.createDraftAsLatestVersion(),
          permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
          locks: [],
          hasValidTermsOfAccess: false,
          isValid: true
        })}
      />
    </RepositoriesStoryProvider>
  )
}

export const DatasetInReview: Story = {
  render: () => (
    <RepositoriesStoryProvider
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}>
      <PublishDatasetMenu
        dataset={DatasetMother.create({
          version: DatasetVersionMother.createDraftAsLatestVersionInReview(),
          permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
          locks: [],
          hasValidTermsOfAccess: true,
          isValid: true
        })}
      />
    </RepositoriesStoryProvider>
  )
}

export const ReturnToAuthor: Story = {
  ...DatasetInReview,
  play: async ({ canvasElement }) => {
    const { within, userEvent, expect, waitFor } = await import('@storybook/test')
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Publish Dataset' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Return to Author' }))
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
      name: 'Return to Author'
    })
    await waitFor(() => expect(dialog).toBeVisible())
  }
}

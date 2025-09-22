import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { UnlinkDatasetButton } from '@/sections/dataset/dataset-action-buttons/link-and-unlink-actions/unlink-dataset-button/UnlinkDatasetButton'
import { DatasetMockRepository } from '../../DatasetMockRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { WithToasts } from '@/stories/WithToasts'

const meta: Meta<typeof UnlinkDatasetButton> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/UnlinkDatasetButton',
  component: UnlinkDatasetButton,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithToasts],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof UnlinkDatasetButton>

export const Default: Story = {
  render: () => (
    <UnlinkDatasetButton
      dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
      datasetRepository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      updateParent={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole(
      'button',
      { name: 'Unlink Dataset' },
      { timeout: 6000 }
    )
    userEvent.click(dropdownBtn)
  }
}

const withOnlyOneCollectionToUnlinkRepo = new CollectionMockRepository()
withOnlyOneCollectionToUnlinkRepo.getForUnlinking = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 2,
          alias: 'only-collection-to-link',
          displayName: 'Only Collection to Unlink'
        }
      ])
    }, FakerHelper.loadingTimout())
  })
}

export const WithOnlyOneCollectionToUnlink: Story = {
  render: () => (
    <UnlinkDatasetButton
      dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
      datasetRepository={new DatasetMockRepository()}
      collectionRepository={withOnlyOneCollectionToUnlinkRepo}
      updateParent={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole(
      'button',
      { name: 'Unlink Dataset' },
      { timeout: 6000 }
    )
    userEvent.click(dropdownBtn)
  }
}

import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { LinkDatasetButton } from '../../../../sections/dataset/dataset-action-buttons/link-dataset-button/LinkDatasetButton'
import { DatasetMockRepository } from '../../DatasetMockRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { WithToasts } from '@/stories/WithToasts'

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

const datasetRepo = new DatasetMockRepository()
datasetRepo.getDatasetLinkedCollections = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, FakerHelper.loadingTimout())
  })
}

export const Default: Story = {
  render: () => (
    <LinkDatasetButton
      dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
      datasetRepository={datasetRepo}
      collectionRepository={new CollectionMockRepository()}
      updateParent={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link Dataset' })
    userEvent.click(dropdownBtn)
  }
}

export const WithLinkedCollections: Story = {
  render: () => (
    <LinkDatasetButton
      dataset={DatasetMother.create({ version: DatasetVersionMother.createReleased() })}
      datasetRepository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      updateParent={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const dropdownBtn = await canvas.findByRole('button', { name: 'Link Dataset' })
    userEvent.click(dropdownBtn)
  }
}

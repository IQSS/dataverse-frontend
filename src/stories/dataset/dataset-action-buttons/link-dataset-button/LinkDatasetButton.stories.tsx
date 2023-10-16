import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { DatasetMother } from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { LinkDatasetButton } from '../../../../sections/dataset/dataset-action-buttons/link-dataset-button/LinkDatasetButton'

const meta: Meta<typeof LinkDatasetButton> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/LinkDatasetButton',
  component: LinkDatasetButton,
  decorators: [WithI18next, WithSettings],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof LinkDatasetButton>

export const ReleasedDataset: Story = {
  render: () => <LinkDatasetButton dataset={DatasetMother.create({ isReleased: true })} />
}

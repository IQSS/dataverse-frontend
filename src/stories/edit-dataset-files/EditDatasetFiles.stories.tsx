import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { EditDatasetFiles } from '../../sections/edit-dataset-files/EditDatasetFiles'
import { FileMockRepository } from '../file/FileMockRepository'
import { WithDataset } from '../dataset/WithDataset'

const meta: Meta<typeof EditDatasetFiles> = {
  title: 'Pages/Edit Dataset Files',
  component: EditDatasetFiles,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditDatasetFiles>

export const Default: Story = {
  decorators: [WithLayout, WithDataset],
  render: () => <EditDatasetFiles fileRepository={new FileMockRepository()} />
}

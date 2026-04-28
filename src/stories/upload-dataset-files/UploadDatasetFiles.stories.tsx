import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { UploadDatasetFiles } from '../../sections/upload-dataset-files/UploadDatasetFiles'
import { FileMockRepository } from '../file/FileMockRepository'
import { WithDataset } from '../dataset/WithDataset'

const meta: Meta<typeof UploadDatasetFiles> = {
  title: 'Pages/Upload Dataset Files',
  component: UploadDatasetFiles,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof UploadDatasetFiles>

export const Default: Story = {
  decorators: [WithLayout, WithDataset],
  render: () => <UploadDatasetFiles fileRepository={new FileMockRepository()} />
}

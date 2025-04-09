import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { FileMockRepository } from '../file/FileMockRepository'
import { WithDataset } from '../dataset/WithDataset'
import { EditFileMetadata } from '@/sections/edit-file-metadata/EditFileMetadata'
import { WithToasts } from '../WithToasts'

const meta: Meta<typeof EditFileMetadata> = {
  title: 'Pages/Edit File Metadata',
  component: EditFileMetadata,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditFileMetadata>

export const Default: Story = {
  decorators: [WithLayout, WithDataset, WithToasts],
  render: () => <EditFileMetadata fileRepository={new FileMockRepository()} fileId={1} />
}

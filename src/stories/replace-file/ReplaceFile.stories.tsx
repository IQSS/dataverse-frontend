import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { FileMockRepository } from '../file/FileMockRepository'
import { WithDataset } from '../dataset/WithDataset'
import { ReplaceFile } from '@/sections/replace-file/ReplaceFile'
import { WithToasts } from '../WithToasts'

const meta: Meta<typeof ReplaceFile> = {
  title: 'Pages/Replace File',
  component: ReplaceFile,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof ReplaceFile>

export const Default: Story = {
  decorators: [WithLayout, WithDataset, WithToasts],
  render: () => (
    <ReplaceFile
      fileRepository={new FileMockRepository()}
      fileIdFromParams={1}
      datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
      datasetVersionFromParams=":draft"
    />
  )
}

import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import {
  FileVersions,
  FileVersionsLoadingSkeleton
} from '../../../sections/file/file-version/FileVersions'
import { FileMockRepository } from '../FileMockRepository'

const meta: Meta<typeof FileVersions> = {
  title: 'Sections/File Page/FileVersions',
  component: FileVersions,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileVersions>

export const Default: Story = {
  render: () => (
    <FileVersions
      fileId={4}
      datasetVersionNumber={'2.0'}
      fileRepository={new FileMockRepository()}
      isInView={true}
    />
  )
}

export const Loading: Story = {
  render: () => <FileVersionsLoadingSkeleton />
}

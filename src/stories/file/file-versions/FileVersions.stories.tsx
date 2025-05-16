import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileVersions } from '../../../sections/file/file-version/FileVersions'
import { FileMother } from '../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileVersions> = {
  title: 'Sections/File Page/FileVersions',
  component: FileVersions,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileVersions>

export const Default: Story = {
  render: () => (
    <FileVersions version={FileMother.createFileVersionSummary()} datasetVersionNumber={'2.0'} />
  )
}

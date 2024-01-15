import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileMetadata } from '../../../sections/file/file-metadata/FileMetadata'
import { FileMother } from '../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileMetadata> = {
  title: 'Sections/File Page/FileMetadata',
  component: FileMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileMetadata>

export const Default: Story = {
  render: () => <FileMetadata file={FileMother.createRealistic()} />
}

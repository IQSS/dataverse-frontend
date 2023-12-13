import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { FileInfoCell } from '../../../../../../sections/dataset/dataset-files/files-table/file-info/file-info-cell/FileInfoCell'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileInfoCell> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/FileInfoCell',
  component: FileInfoCell,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileInfoCell>

export const Default: Story = {
  render: () => <FileInfoCell file={FileMother.createDefault()} />
}

export const WithLabels: Story = {
  render: () => <FileInfoCell file={FileMother.createWithLabels()} />
}

export const WithDirectory: Story = {
  render: () => <FileInfoCell file={FileMother.createWithDirectory()} />
}

export const WithEmbargo: Story = {
  render: () => <FileInfoCell file={FileMother.createWithEmbargo()} />
}

export const WithTabularData: Story = {
  render: () => <FileInfoCell file={FileMother.createTabular()} />
}

export const WithDescription: Story = {
  render: () => <FileInfoCell file={FileMother.createWithDescription()} />
}

export const WithChecksum: Story = {
  render: () => <FileInfoCell file={FileMother.createWithChecksum()} />
}

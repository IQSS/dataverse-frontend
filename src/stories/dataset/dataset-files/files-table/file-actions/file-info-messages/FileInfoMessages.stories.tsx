import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { FileInfoMessages } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/FileInfoMessages'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileInfoMessages> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileInfoMessages/FileInfoMessages',
  component: FileInfoMessages,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof FileInfoMessages>

export const IngestInProgress: Story = {
  render: () => <FileInfoMessages file={FileMother.createIngestInProgress()} />
}

export const IngestProblemDefaultReportMessage: Story = {
  render: () => (
    <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
      <FileInfoMessages file={FileMother.createIngestProblem()} />
    </div>
  )
}

export const IngestProblemCustomReportMessage: Story = {
  render: () => (
    <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
      <FileInfoMessages
        file={FileMother.createIngestProblem('The header contains a duplicate name.')}
      />
    </div>
  )
}

export const AccessRequested: Story = {
  render: () => <FileInfoMessages file={FileMother.createWithAccessRequestPending()} />
}

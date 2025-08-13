import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { FileInfoMessages } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/FileInfoMessages'
import { WithDatasetAllPermissionsGranted } from '../../../../WithDatasetAllPermissionsGranted'
import { FilePreviewMother } from '../../../../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof FileInfoMessages> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileInfoMessages/FileInfoMessages',
  component: FileInfoMessages,
  decorators: [WithI18next, WithSettings, WithDatasetAllPermissionsGranted],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FileInfoMessages>

export const IngestInProgress: Story = {
  render: () => <FileInfoMessages file={FilePreviewMother.createIngestInProgress()} />
}

export const IngestProblemDefaultReportMessage: Story = {
  render: () => (
    <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
      <FileInfoMessages file={FilePreviewMother.createIngestProblem()} />
    </div>
  )
}

export const IngestProblemCustomReportMessage: Story = {
  render: () => (
    <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
      <FileInfoMessages
        file={FilePreviewMother.createIngestProblem('The header contains a duplicate name.')}
      />
    </div>
  )
}

export const AccessRequested: Story = {
  render: () => <FileInfoMessages file={FilePreviewMother.createWithAccessRequestPending()} />
}

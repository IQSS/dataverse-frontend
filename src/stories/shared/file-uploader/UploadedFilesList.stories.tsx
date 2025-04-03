import { UploadedFilesList } from '@/sections/shared/file-uploader/uploaded-files-list/UploadedFilesList'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { WithFileUploaderContext } from './WithFileUploaderContext'
import { FileUploadStatus } from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'

const meta: Meta<typeof UploadedFilesList> = {
  title: 'Sections/Shared/File Uploader/Uploaded Files List',
  component: UploadedFilesList,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof UploadedFilesList>

export const Default: Story = {
  render: () => (
    <WithFileUploaderContext
      mode={OperationType.REPLACE_FILE}
      filesToAdd={[
        {
          file: new File(['dummy content'], 'file_one.pdf', { type: 'application/pdf' }),
          updates: {
            status: FileUploadStatus.DONE,
            progress: 100,
            checksumAlgorithm: FixityAlgorithm.MD5,
            checksumValue: '1234567890A',
            storageId: '1234567890A'
          }
        },
        {
          file: new File(['dummy content'], 'file_two.png', { type: 'image/png' }),
          updates: {
            status: FileUploadStatus.DONE,
            progress: 100,
            checksumAlgorithm: FixityAlgorithm.MD5,
            checksumValue: '1234567890B',
            storageId: '1234567890B'
          }
        },
        {
          file: new File(['dummy content'], 'file_three.pdf', { type: 'application/pdf' }),
          updates: {
            status: FileUploadStatus.DONE,
            progress: 100,
            checksumAlgorithm: FixityAlgorithm.MD5,
            checksumValue: '1234567890C',
            storageId: '1234567890C'
          }
        },
        {
          file: new File(['dummy content'], 'file_four.png', { type: 'image/png' }),
          updates: {
            status: FileUploadStatus.DONE,
            progress: 100,
            checksumAlgorithm: FixityAlgorithm.MD5,
            checksumValue: '1234567890D',
            storageId: '1234567890D'
          }
        }
      ]}>
      <UploadedFilesList
        datasetPersistentId="doi:10.5072/FK2/8YOKQI"
        fileRepository={new FileMockRepository()}
      />
    </WithFileUploaderContext>
  )
}

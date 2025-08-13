import FileUploadInput from '@/sections/shared/file-uploader/file-upload-input/FileUploadInput'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { WithI18next } from '@/stories/WithI18next'
import { WithToasts } from '@/stories/WithToasts'
import { Meta, StoryObj } from '@storybook/react'
import { WithFileUploaderContext } from './WithFileUploaderContext'
import { FileUploadStatus } from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'

const meta: Meta<typeof FileUploadInput> = {
  title: 'Sections/Shared/File Uploader/File Upload Input',
  component: FileUploadInput,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FileUploadInput>

export const ReplaceMode: Story = {
  decorators: [WithToasts],
  render: () => (
    <WithFileUploaderContext mode={OperationType.REPLACE_FILE}>
      <FileUploadInput
        datasetPersistentId="doi:10.5072/FK2/8YOKQI"
        fileRepository={new FileMockRepository()}
      />
    </WithFileUploaderContext>
  )
}

export const AddMode: Story = {
  decorators: [WithToasts],
  render: () => (
    <WithFileUploaderContext mode={OperationType.ADD_FILES_TO_DATASET}>
      <FileUploadInput
        datasetPersistentId="doi:10.5072/FK2/8YOKQI"
        fileRepository={new FileMockRepository()}
      />
    </WithFileUploaderContext>
  )
}

export const WithUploadingFiles: Story = {
  decorators: [WithToasts],
  render: () => (
    <WithFileUploaderContext
      mode={OperationType.ADD_FILES_TO_DATASET}
      filesToAdd={[
        {
          file: new File(['dummy content'], 'file_one.pdf', { type: 'application/pdf' }),
          updates: {
            status: FileUploadStatus.UPLOADING,
            progress: 45
          }
        },
        {
          file: new File(['dummy content'], 'file_two.png', { type: 'image/png' }),
          updates: {
            status: FileUploadStatus.UPLOADING,
            progress: 10
          }
        },
        {
          file: new File(['dummy content'], 'file_three.txt', { type: 'text/plain' }),
          updates: {
            status: FileUploadStatus.UPLOADING,
            progress: 90,
            fileDir: 'some-dir'
          }
        },
        {
          file: new File(['dummy content'], 'file_four.pdf', { type: 'application/pdf' }),
          updates: {
            status: FileUploadStatus.UPLOADING,
            progress: 45
          }
        }
      ]}>
      <FileUploadInput
        datasetPersistentId="doi:10.5072/FK2/8YOKQI"
        fileRepository={new FileMockRepository()}
      />
    </WithFileUploaderContext>
  )
}

export const WithFailedFile: Story = {
  decorators: [WithToasts],
  render: () => (
    <WithFileUploaderContext
      mode={OperationType.ADD_FILES_TO_DATASET}
      filesToAdd={[
        {
          file: new File(['dummy content'], 'some_file.pdf', { type: 'application/pdf' }),
          updates: {
            status: FileUploadStatus.FAILED
          }
        },
        {
          file: new File(['dummy content'], 'another_file.txt', { type: 'text/plain' }),
          updates: {
            status: FileUploadStatus.UPLOADING,
            progress: 45
          }
        }
      ]}>
      <FileUploadInput
        datasetPersistentId="doi:10.5072/FK2/8YOKQI"
        fileRepository={new FileMockRepository()}
      />
    </WithFileUploaderContext>
  )
}

import { FileUploader, OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { WithI18next } from '@/stories/WithI18next'
import { WithToasts } from '@/stories/WithToasts'
import { Meta, StoryObj } from '@storybook/react'
import { FileMother } from '@tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileUploader> = {
  title: 'Sections/Shared/File Uploader',
  component: FileUploader,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FileUploader>

export const ReplaceMode: Story = {
  decorators: [WithToasts],
  render: () => (
    <FileUploader
      fileRepository={new FileMockRepository()}
      datasetPersistentId="doi:10.5072/FK2/8YOKQI"
      storageType="S3"
      operationType={OperationType.REPLACE_FILE}
      originalFile={FileMother.createRealistic()}
    />
  )
}

export const AddFilesToDataset: Story = {
  decorators: [WithToasts],
  render: () => (
    <FileUploader
      fileRepository={new FileMockRepository()}
      datasetPersistentId="doi:10.5072/FK2/8YOKQI"
      storageType="S3"
      operationType={OperationType.ADD_FILES_TO_DATASET}
    />
  )
}

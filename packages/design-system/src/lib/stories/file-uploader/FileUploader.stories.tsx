import type { Meta, StoryObj } from '@storybook/react'
import { FileUploadState, FileUploader } from '../../components/file-uploader/FileUploader'

/**
 * ## Description
 * A file uploader allows users to upload files.
 */
const meta: Meta<typeof FileUploader> = {
  title: 'File uploader',
  component: FileUploader,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof FileUploader>

export const Default: Story = {
  render: () => (
    <FileUploader
      upload={function (files: File[]): Map<string, FileUploadState> {
        const res = new Map<string, FileUploadState>()
        files.forEach((f) => {
          const key = f.webkitRelativePath + f.name
          const value: FileUploadState = {
            progress: Math.random() * 100,
            fileSizeString: f.size.toString() + ' B',
            failed: Math.random() > 0.9,
            done: false,
            removed: Math.random() > 0.95
          }
          res.set(key, value)
        })
        return res
      }}
      cancelTitle={'Cancel upload'}
      info={'Drag and drop files here.'}
      selectText={'Select Files to Add'}></FileUploader>
  )
}

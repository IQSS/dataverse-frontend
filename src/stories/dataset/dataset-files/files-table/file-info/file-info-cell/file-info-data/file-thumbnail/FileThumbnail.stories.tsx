import { Meta, StoryObj } from '@storybook/react'
import { FileThumbnail } from '../../../../../../../../sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { WithI18next } from '../../../../../../../WithI18next'
import { FilePreviewMother } from '../../../../../../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof FileThumbnail> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/FileInfoCell/FileThumbnail',
  component: FileThumbnail,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileThumbnail>

export const WithIcon: Story = {
  render: () => {
    const file = FilePreviewMother.createDefault()
    return <FileThumbnail file={file} />
  }
}

export const WithThumbnailPreview: Story = {
  render: () => {
    const file = FilePreviewMother.createWithThumbnail()
    return <FileThumbnail file={file} />
  }
}

export const WithThumbnailRestrictedLockedIcon: Story = {
  render: () => {
    const file = FilePreviewMother.createWithRestrictedAccess()
    return <FileThumbnail file={file} />
  }
}

export const WithThumbnailRestrictedUnlockedIcon: Story = {
  render: () => {
    const file = FilePreviewMother.createWithRestrictedAccessWithAccessGranted()
    return <FileThumbnail file={file} />
  }
}

export const WithThumbnailPreviewRestrictedUnlockedIcon: Story = {
  render: () => {
    const file = FilePreviewMother.createWithThumbnailRestrictedWithAccessGranted()
    return <FileThumbnail file={file} />
  }
}

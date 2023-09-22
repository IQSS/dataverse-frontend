import { Meta, StoryObj } from '@storybook/react'
import { FileThumbnail } from '../../../../../../../../sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { WithI18next } from '../../../../../../../WithI18next'
import { FileMother } from '../../../../../../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileThumbnail> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/FileInfoCell/FileThumbnail',
  component: FileThumbnail,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileThumbnail>

export const WithIcon: Story = {
  render: () => {
    const file = FileMother.createDefault()
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        lockStatus={file.lockStatus}
      />
    )
  }
}

export const WithThumbnailPreview: Story = {
  render: () => {
    const file = FileMother.createWithThumbnail()
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        lockStatus={file.lockStatus}
      />
    )
  }
}

export const WithThumbnailRestrictedLockedIcon: Story = {
  render: () => {
    const file = FileMother.createWithRestrictedAccess()
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        lockStatus={file.lockStatus}
      />
    )
  }
}

export const WithThumbnailRestrictedUnlockedIcon: Story = {
  render: () => {
    const file = FileMother.createWithRestrictedAccessWithAccessGranted()
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        lockStatus={file.lockStatus}
      />
    )
  }
}

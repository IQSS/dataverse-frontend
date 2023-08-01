import { Meta, StoryObj } from '@storybook/react'
import { faker } from '@faker-js/faker'
import { FileThumbnail } from '../../../../../../sections/dataset/dataset-files/files-table/file-info-cell/file-thumbnail/FileThumbnail'
import { WithI18next } from '../../../../../WithI18next'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'
import { FileType } from '../../../../../../files/domain/models/File'

const meta: Meta<typeof FileThumbnail> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/FileInfoCell/FileThumbnail',
  component: FileThumbnail,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileThumbnail>

export const WithIcon: Story = {
  render: () => {
    const file = FileMother.create({
      type: new FileType('some-type'),
      access: { restricted: false, canDownload: true },
      thumbnail: undefined
    })
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        access={file.access}
      />
    )
  }
}

export const WithThumbnailPreview: Story = {
  render: () => {
    const file = FileMother.create({
      access: { restricted: false, canDownload: true },
      thumbnail: faker.image.imageUrl()
    })
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        access={file.access}
      />
    )
  }
}

export const WithThumbnailRestrictedLockedIcon: Story = {
  render: () => {
    const file = FileMother.create({ access: { restricted: true, canDownload: false } })
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        access={file.access}
      />
    )
  }
}

export const WithThumbnailRestrictedUnlockedIcon: Story = {
  render: () => {
    const file = FileMother.create({ access: { restricted: true, canDownload: true } })
    return (
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        access={file.access}
      />
    )
  }
}

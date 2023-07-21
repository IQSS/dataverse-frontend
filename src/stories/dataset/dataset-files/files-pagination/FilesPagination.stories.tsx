import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { FilesPagination } from '../../../../sections/dataset/dataset-files/files-pagination/FilesPagination'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

const meta: Meta<typeof FilesPagination> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesPagination',
  component: FilesPagination,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FilesPagination>

const emptyFunction = () => {}
export const Default: Story = {
  render: () => (
    <FilesPagination
      paginationInfoInitial={new FilePaginationInfo(10, 10, 200)}
      onPaginationInfoChange={emptyFunction}
    />
  )
}

export const NoEllipsis: Story = {
  render: () => (
    <FilesPagination
      paginationInfoInitial={new FilePaginationInfo(1, 10, 100)}
      onPaginationInfoChange={emptyFunction}
    />
  )
}

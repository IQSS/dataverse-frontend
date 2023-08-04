import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { FilesPagination } from '../../../../sections/dataset/dataset-files/files-pagination/FilesPagination'

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
    <FilesPagination page={10} pageSize={10} total={200} onPaginationInfoChange={emptyFunction} />
  )
}

export const NoEllipsis: Story = {
  render: () => (
    <FilesPagination page={1} pageSize={10} total={100} onPaginationInfoChange={emptyFunction} />
  )
}

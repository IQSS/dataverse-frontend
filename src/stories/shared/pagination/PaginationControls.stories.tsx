import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { PaginationControls } from '../../../sections/shared/pagination/PaginationControls'
import { PaginationInfo } from '../../../shared/domain/models/PaginationInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'

const meta: Meta<typeof PaginationControls> = {
  title: 'Sections/Shared/Pagination/PaginationControls',
  component: PaginationControls,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof PaginationControls>

const emptyFunction = () => {}
export const Default: Story = {
  render: () => (
    <PaginationControls
      initialPaginationInfo={
        new PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>(10, 10, 200)
      }
      onPaginationInfoChange={emptyFunction}
    />
  )
}

export const NoEllipsis: Story = {
  render: () => (
    <PaginationControls
      initialPaginationInfo={
        new PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>(1, 10, 100)
      }
      onPaginationInfoChange={emptyFunction}
    />
  )
}

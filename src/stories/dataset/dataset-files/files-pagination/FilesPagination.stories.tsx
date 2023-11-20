import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { PaginationControls } from '../../../../sections/shared/pagination/PaginationControls'

const meta: Meta<typeof PaginationControls> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesPagination',
  component: PaginationControls,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof PaginationControls>

const emptyFunction = () => {}
export const Default: Story = {
  render: () => (
    <PaginationControls
      page={10}
      pageSize={10}
      total={200}
      onPaginationInfoChange={emptyFunction}
    />
  )
}

export const NoEllipsis: Story = {
  render: () => (
    <PaginationControls page={1} pageSize={10} total={100} onPaginationInfoChange={emptyFunction} />
  )
}

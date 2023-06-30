import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '../../components/pagination/Pagination'

/**
 * ## Description
 * The pagination component is a user interface element that allows users to navigate through a collection of items or
 * pages. It is commonly used to display a large set of data in smaller, manageable chunks.

 * ## Usage guidelines
 * The pagination component should be used when there is a need to break down a large amount of content into smaller
 * sections to enhance usability and navigation. It should be placed at the bottom or top of the content it controls
 * and provide clear navigation options for users to move between pages.
 */
const meta: Meta<typeof Pagination> = {
  title: 'Pagination',
  component: Pagination,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: () => (
    <Pagination>
      <Pagination.First onClick={() => {}} />
      <Pagination.Prev onClick={() => {}} />
      <Pagination.Item pageNumber={1} onClick={() => {}} />
      <Pagination.Ellipsis />
      <Pagination.Item pageNumber={10} onClick={() => {}} />
      <Pagination.Item pageNumber={11} onClick={() => {}} />
      <Pagination.Item pageNumber={12} active onClick={() => {}} />
      <Pagination.Item pageNumber={13} onClick={() => {}} />
      <Pagination.Item pageNumber={14} onClick={() => {}} />
      <Pagination.Ellipsis />
      <Pagination.Item pageNumber={20} onClick={() => {}} />
      <Pagination.Next onClick={() => {}} />
      <Pagination.Last onClick={() => {}} />
    </Pagination>
  )
}

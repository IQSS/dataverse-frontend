import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { EditFileTagsModal } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/edit-file-tags-modal/EditFileTagsModal'
import { WithSettings } from '@/stories/WithSettings'

const meta: Meta<typeof EditFileTagsModal> = {
  title: 'Sections/File Page/Action Buttons/EditFileMenu/EditFileTagsModal',
  component: EditFileTagsModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof EditFileTagsModal>

export const WithExistingLabels: Story = {
  render: () => (
    <EditFileTagsModal
      show
      fileId={123}
      handleClose={() => {}}
      handleUpdateCategories={() => Promise.resolve()}
      isUpdatingFileCategories={false}
      errorUpdatingFileCategories={null}
      handleUpdateTabularTags={() => Promise.resolve()}
      isUpdatingTabularTags={false}
      errorUpdatingTabularTags={null}
      isTabularFile={true}
    />
  )
}

export const WithLoading: Story = {
  render: () => (
    <EditFileTagsModal
      show
      fileId={123}
      handleClose={() => {}}
      handleUpdateCategories={() => Promise.resolve()}
      isUpdatingFileCategories={true}
      errorUpdatingFileCategories={null}
      handleUpdateTabularTags={() => Promise.resolve()}
      isUpdatingTabularTags={true}
      errorUpdatingTabularTags={null}
      isTabularFile={true}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <EditFileTagsModal
      show
      fileId={123}
      handleClose={() => {}}
      handleUpdateCategories={() => Promise.resolve()}
      isUpdatingFileCategories={false}
      errorUpdatingFileCategories="Something went wrong updating the file categories."
      handleUpdateTabularTags={() => Promise.resolve()}
      isUpdatingTabularTags={false}
      errorUpdatingTabularTags="Something went wrong updating the file tabular tags."
      isTabularFile={true}
    />
  )
}

export const NonTabularFile: Story = {
  render: () => (
    <EditFileTagsModal
      show
      fileId={123}
      handleClose={() => {}}
      handleUpdateCategories={() => Promise.resolve()}
      isUpdatingFileCategories={false}
      errorUpdatingFileCategories={null}
      handleUpdateTabularTags={() => Promise.resolve()}
      isUpdatingTabularTags={false}
      errorUpdatingTabularTags={null}
      isTabularFile={false}
    />
  )
}

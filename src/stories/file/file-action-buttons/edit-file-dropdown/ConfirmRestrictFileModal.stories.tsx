import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { ConfirmRestrictFileModal } from '@/sections/file/file-action-buttons/edit-file-menu/restrict-file-button/confirm-restrict-file-modal/ConfirmRestrictFileModal'

const meta: Meta<typeof ConfirmRestrictFileModal> = {
  title: 'Sections/File Page/Action Buttons/EditFileMenu/ConfirmRestrictFileModal',
  component: ConfirmRestrictFileModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof ConfirmRestrictFileModal>

export const WithDatasetNotReleased: Story = {
  render: () => (
    <ConfirmRestrictFileModal
      show
      datasetReleasedVersionExists={false}
      isRestrictingFile={false}
      errorRestrictingFile={null}
      handleClose={() => {}}
      handleRestrict={() => {}}
      termsOfAccessForRestrictedFiles="terms of access for restricted files"
      isRestricted={false}
      requestAccess={false}
    />
  )
}

export const WithReleasedDataset: Story = {
  render: () => (
    <ConfirmRestrictFileModal
      show
      datasetReleasedVersionExists={true}
      isRestrictingFile={false}
      errorRestrictingFile={null}
      handleClose={() => {}}
      handleRestrict={() => {}}
      termsOfAccessForRestrictedFiles="terms of access for restricted files"
      isRestricted={false}
      requestAccess={false}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <ConfirmRestrictFileModal
      show
      datasetReleasedVersionExists={false}
      isRestrictingFile={false}
      errorRestrictingFile="Something went wrong deleting the file. Try again later."
      handleClose={() => {}}
      handleRestrict={() => {}}
      termsOfAccessForRestrictedFiles="terms of access for restricted files"
      isRestricted={false}
      requestAccess={false}
    />
  )
}

export const RestrictingFileInProgress: Story = {
  render: () => (
    <ConfirmRestrictFileModal
      show
      datasetReleasedVersionExists={false}
      isRestrictingFile={true}
      errorRestrictingFile={null}
      handleClose={() => {}}
      handleRestrict={() => {}}
      termsOfAccessForRestrictedFiles="terms of access for restricted files"
      isRestricted={false}
      requestAccess={false}
    />
  )
}

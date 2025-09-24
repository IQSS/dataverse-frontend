import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { RestrictedFilesTab } from '../../sections/edit-dataset-terms/restricted-files-tab/RestrictedFilesTab'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const meta: Meta<typeof RestrictedFilesTab> = {
  title: 'Sections/EditDatasetTerms/RestrictedFilesTab',
  component: RestrictedFilesTab,
  decorators: [WithI18next, WithLayout],
  parameters: {
    chromatic: { delay: 1000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof RestrictedFilesTab>

const initialTermsOfAccess = {
  fileAccessRequest: true,
  termsOfAccessForRestrictedFiles: 'Terms of access for restricted files',
  dataAccessPlace: 'Data access place',
  originalArchive: 'Original archive',
  availabilityStatus: 'Availability status',
  contactForAccess: 'Contact for access',
  sizeOfCollection: 'Size of collection',
  studyCompletion: 'Study completion'
}
export const Default: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new DatasetJSDataverseRepository()}
      initialTermsOfAccess={initialTermsOfAccess}
    />
  )
}

export const WithFormInteraction: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new DatasetJSDataverseRepository()}
      initialTermsOfAccess={initialTermsOfAccess}
    />
  )
}

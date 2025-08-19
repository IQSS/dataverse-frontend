import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { EditDatasetTerms } from '../../sections/edit-dataset-terms/EditDatasetTerms'
import { EditDatasetTermsHelper } from '../../sections/edit-dataset-terms/EditDatasetTermsHelper'

const meta: Meta<typeof EditDatasetTerms> = {
  title: 'Pages/EditDatasetTerms',
  component: EditDatasetTerms,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 1000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditDatasetTerms>

export const DatasetTermsTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
    />
  )
}

export const RestrictedFilesTermsTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms}
    />
  ),
  parameters: {
    chromatic: { delay: 2000 }
  }
}

export const GuestBookTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestBook}
    />
  )
}

export const AllTabs: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
    />
  )
}

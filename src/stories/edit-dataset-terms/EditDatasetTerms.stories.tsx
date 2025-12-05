import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithDataset } from '../dataset/WithDataset'
import { EditDatasetTerms } from '../../sections/edit-dataset-terms/EditDatasetTerms'
import { EditDatasetTermsHelper } from '../../sections/edit-dataset-terms/EditDatasetTermsHelper'
import { LicenseMockRepository } from '../shared-mock-repositories/license/LicenseMockRepository'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

const meta: Meta<typeof EditDatasetTerms> = {
  title: 'Pages/EditDatasetTerms',
  component: EditDatasetTerms,
  decorators: [WithI18next, WithLayout, WithDataset],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditDatasetTerms>

const licenseRepository: LicenseRepository = new LicenseMockRepository() as LicenseRepository
const datasetRepository: DatasetRepository = new DatasetMockRepository() as DatasetRepository

export const EditLicenseAndTermsTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
    />
  )
}

export const EditTermsOfAccessTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
    />
  )
}

export const EditGuestBookTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestBook}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
    />
  )
}

import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithDataset } from '../dataset/WithDataset'
import { EditDatasetTerms } from '../../sections/edit-dataset-terms/EditDatasetTerms'
import { EditDatasetTermsHelper } from '@/sections/edit-dataset-terms/EditDatasetTermsHelper'
import { LicenseMockRepository } from '../shared-mock-repositories/license/LicenseMockRepository'
import { GuestbookMockRepository } from '../shared-mock-repositories/guestbook/GuestbookMockRepository'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { WithRepositories } from '../WithRepositories'

const licenseRepository: LicenseRepository = new LicenseMockRepository() as LicenseRepository
const datasetRepository: DatasetRepository = new DatasetMockRepository() as DatasetRepository
const guestbookRepository: GuestbookRepository =
  new GuestbookMockRepository() as GuestbookRepository

const meta: Meta<typeof EditDatasetTerms> = {
  title: 'Pages/EditDatasetTerms',
  component: EditDatasetTerms,
  decorators: [WithI18next, WithLayout, WithDataset, WithRepositories({ datasetRepository })],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditDatasetTerms>

export const EditLicenseAndTermsTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
      licenseRepository={licenseRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

export const EditTermsOfAccessTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms}
      licenseRepository={licenseRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

export const EditGuestbookTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
      licenseRepository={licenseRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

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
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'

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
const guestbookRepository: GuestbookRepository = {
  getGuestbook: (_guestbookId: number) =>
    Promise.resolve({
      id: 1,
      name: 'Storybook Guestbook',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    } as Guestbook),
  assignDatasetGuestbook: (_datasetId: number | string, _guestbookId: number) => Promise.resolve(),
  removeDatasetGuestbook: (_datasetId: number | string) => Promise.resolve()
}

export const EditLicenseAndTermsTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

export const EditTermsOfAccessTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

export const EditGuestbookTab: Story = {
  render: () => (
    <EditDatasetTerms
      defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
      licenseRepository={licenseRepository}
      datasetRepository={datasetRepository}
      guestbookRepository={guestbookRepository}
    />
  )
}

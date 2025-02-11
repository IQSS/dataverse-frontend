import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetTerms } from '../../../sections/dataset/dataset-terms/DatasetTerms'
import { FileMockRepository } from '../../file/FileMockRepository'
import { FileMockLoadingRepository } from '../../file/FileMockLoadingRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { LicenseMother } from '../../../../tests/component/dataset/domain/models/LicenseMother'
import { TermsOfUseMother } from '../../../../tests/component/dataset/domain/models/TermsOfUseMother'
import { FileMockRestrictedFilesRepository } from '@/stories/file/FileMockRestrictedFilesRepository'
import { FileMockNoRestrictedFilesRepository } from '@/stories/file/FileMockNoRestrictedFilesRepository'

const meta: Meta<typeof DatasetTerms> = {
  title: 'Sections/Dataset Page/DatasetTerms',
  component: DatasetTerms,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetTerms>

const testDataset = DatasetMother.createRealistic()
const license = LicenseMother.create()
const termsOfUseWithoutCustomTerms = TermsOfUseMother.withoutCustomTerms()

export const Default: Story = {
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockLoadingRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const RestrictedFiles: Story = {
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const NoRestrictedFiles: Story = {
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
export const CustomTerms: Story = {
  render: () => (
    <DatasetTerms
      license={undefined}
      termsOfUse={TermsOfUseMother.create()}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

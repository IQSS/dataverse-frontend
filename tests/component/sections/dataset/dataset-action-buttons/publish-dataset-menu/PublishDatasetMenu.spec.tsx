import { PublishDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/publish-dataset-menu/PublishDatasetMenu'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { SettingMother } from '../../../../settings/domain/models/SettingMother'
import { SettingsProvider } from '../../../../../../src/sections/settings/SettingsProvider'
const collectionRepository = {} as CollectionRepository
const datasetRepository = {} as DatasetRepository
const dataverseInfoRepository = {} as DataverseInfoRepository

describe('PublishDatasetMenu', () => {
  beforeEach(() => {
    dataverseInfoRepository.getHasPublicStore = cy.stub().resolves({})
    dataverseInfoRepository.getExternalStatusesAllowed = cy.stub().resolves({})
    dataverseInfoRepository.getMaxEmbargoDurationInMonths = cy.stub().resolves({})
    dataverseInfoRepository.getZipDownloadLimit = cy.stub().resolves({})
  })
  it('renders the PublishDatasetMenu if is dataset latest version and it is a draft and publishing is allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' })
      .should('exist')
      .click()
      .should('be.enabled')

    cy.findByRole('button', { name: 'Publish' }).should('exist')
  })

  it('renders the PublishDatasetMenu with the Change Curation Status sub menu', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    dataverseInfoRepository.getExternalStatusesAllowed = cy
      .stub()
      .resolves(SettingMother.createExternalStatusesAllowed(['Author Contacted', 'Privacy Review']))

    cy.mountAuthenticated(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <PublishDatasetMenu
          datasetRepository={datasetRepository}
          collectionRepository={collectionRepository}
          dataset={dataset}
        />
      </SettingsProvider>
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).click()

    cy.findByRole('button', { name: 'Change Curation Status' }).should('exist')
  })

  it('does not render if the user is not authenticated', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.customMount(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if publishing is not allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetNotAllowed(),
      locks: []
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not a draft', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not the latest version', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('renders the button enabled if the dataset publishing is locked and the reason is in review and the user has dataset update permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInReview()],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.enabled')
  })

  it('renders the button disabled if the dataset publishing is locked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })

  it('renders the button disabled if the dataset does not have valid terms of access', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: false,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })

  it('renders the button disabled if the dataset is not valid', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: false
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })

  it('renders the Return to Author option if the dataset is in review', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersionInReview(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' })
      .should('exist')
      .click()
      .should('be.enabled')

    cy.findByRole('button', { name: 'Return to Author' }).should('exist')
  })

  it('shows the PublishDatasetModal when the Publish button is clicked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).click()
    cy.findByRole('button', { name: 'Publish' }).click()
    cy.findByRole('dialog').should('exist')
  })

  it('hides the PublishDatasetModal when handleClose is called', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(
      <PublishDatasetMenu
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        dataset={dataset}
      />
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).click()
    cy.findByRole('button', { name: 'Publish' }).click()
    cy.findByRole('dialog').should('exist')

    cy.findByRole('button', { name: 'Close' }).click()
    cy.findByRole('dialog').should('not.exist')
  })
})

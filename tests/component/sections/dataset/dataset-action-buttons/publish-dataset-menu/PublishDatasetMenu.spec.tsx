import { PublishDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/publish-dataset-menu/PublishDatasetMenu'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DatasetLockReason } from '../../../../../../src/dataset/domain/models/Dataset'
import { SettingRepository } from '../../../../../../src/settings/domain/repositories/SettingRepository'
import { SettingMother } from '../../../../settings/domain/models/SettingMother'
import { SettingsProvider } from '../../../../../../src/sections/settings/SettingsProvider'

describe('PublishDatasetMenu', () => {
  it('renders the PublishDatasetMenu if is dataset latest version and it is a draft and publishing is allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

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

    const settingRepository = {} as SettingRepository
    settingRepository.getByName = cy
      .stub()
      .resolves(SettingMother.createExternalStatusesAllowed(['Author Contacted', 'Privacy Review']))

    cy.customMount(
      <SettingsProvider repository={settingRepository}>
        <PublishDatasetMenu dataset={dataset} />
      </SettingsProvider>
    )

    cy.findByRole('button', { name: 'Publish Dataset' }).click()

    cy.findByRole('button', { name: 'Change Curation Status' }).should('exist')
  })

  it('does not render the PublishDatasetMenu if publishing is not allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetNotAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not a draft', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not the latest version', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

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

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.enabled')
  })

  it('renders the button disabled if the dataset publishing is locked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [
        {
          id: 1,
          reason: DatasetLockReason.EDIT_IN_PROGRESS
        }
      ],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

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

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

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

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })
})

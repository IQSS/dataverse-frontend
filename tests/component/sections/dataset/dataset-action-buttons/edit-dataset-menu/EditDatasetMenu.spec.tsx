import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { EditDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/EditDatasetMenu'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'

describe('EditDatasetMenu', () => {
  it('renders the EditDatasetMenu if the user has update dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist').should('be.enabled').click()

    cy.findByRole('button', { name: 'Files (Upload)' }).should('exist')
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Terms' }).should('exist')
    cy.findByRole('button', { name: 'Thumbnails + Widgets' }).should('exist')
    cy.findByRole('button', { name: /Delete/ }).should('exist')
    cy.findByRole('button', { name: 'Permissions' }).should('exist')
    cy.findByRole('button', { name: 'Private URL' }).should('exist')
    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('exist')
  })

  it('does not render if the user is not authenticated', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).should('not.exist')
  })

  it('does not render the EditDatasetMenu if the user does not have update dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetNotAllowed(),
      locks: []
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).should('not.exist')
  })

  it('renders the button disabled if the dataset is locked from edits', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()]
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist').should('be.disabled')
  })

  it('renders some options enabled if the dataset has valid terms of access', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: true
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Files (Upload)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'Metadata' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('renders some options disabled if the dataset does not have valid terms of access', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [],
      hasValidTermsOfAccess: false
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Files (Upload)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Metadata' }).should('exist').should('have.class', 'disabled')
  })

  it('clicks on the Files (Upload) button', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true
    })

    cy.mountAuthenticated(<EditDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Files (Upload)' }).click()
  })

  it('clicks on the Files (Upload) button and dataset version is DRAFT', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true,
      version: DatasetVersionMother.createDraft()
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Files (Upload)' }).click()
  })

  it('clicks on the Metadata button', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Metadata' }).click()
  })
  it('clicks on the Deaccession button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
    cy.findByText('Deaccession is permanent.').should('exist')
  })
  it('clicks on the Terms button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      locks: [],
      hasValidTermsOfAccess: true
    })

    cy.mountAuthenticated(
      <EditDatasetMenu datasetRepository={new DatasetMockRepository()} dataset={dataset} />
    )

    cy.findByRole('button', { name: 'Edit Dataset' }).click()
    cy.findByRole('button', { name: 'Terms' }).click()
  })
})

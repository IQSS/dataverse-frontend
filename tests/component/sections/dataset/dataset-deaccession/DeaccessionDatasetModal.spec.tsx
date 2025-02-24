// cypress/component/DeaccessionDatasetModal.spec.tsx

import { DeaccessionDatasetModal } from '@/sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { VersionSummary } from '@/dataset/domain/models/DatasetVersionDiff'

describe('DeaccessionDatasetModal', () => {
  const repository: DatasetRepository = {} as DatasetRepository
  const persistentId = 'test-persistent-id'
  const versionList: VersionSummary[] = [
    { versionNumber: '1.0', lastUpdatedDate: '2023-01-01' },
    { versionNumber: '2.0', lastUpdatedDate: '2023-02-01' }
  ]
  const handleClose = cy.stub()

  it('renders correctly', () => {
    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={versionList}
        handleClose={handleClose}
      />
    )

    cy.get('div').contains('Warning Text').should('exist')
    cy.get('form').should('exist')
    cy.get('input[type="checkbox"]').should('have.length', versionList.length)
    cy.get('select').should('exist')
    cy.get('textarea').should('exist')
  })

  it('submits the form', () => {
    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={versionList}
        handleClose={handleClose}
      />
    )

    cy.get('input[type="checkbox"]').first().check()
    cy.get('select').select('Option 1')
    cy.get('textarea').type('Additional information')
    cy.get('button[type="submit"]').click()

    // Add assertions to verify form submission behavior
  })
})

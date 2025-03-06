// cypress/component/DeaccessionDatasetModal.spec.tsx

import { DeaccessionDatasetModal } from '@/sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'

describe('DeaccessionDatasetModal', () => {
  const repository: DatasetRepository = {} as DatasetRepository
  const persistentId = 'test-persistent-id'
  const versionList: DatasetVersionSummaryInfo[] = [
    {
      id: 1,
      versionNumber: '1.0',
      publishedOn: '2021-01-01',
      contributors: 'Contributors'
    },
    {
      id: 2,
      versionNumber: '2.0',
      publishedOn: '2021-01-02',
      contributors: 'Contributors'
    }
  ]

  it('renders correctly', () => {
    const handleClose = cy.stub()

    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={versionList}
        handleClose={handleClose}
      />
    )

    cy.get('div').contains('Deaccession is permanent.').should('exist')
    cy.get('form').should('exist')
    cy.get('input[type="checkbox"]').should('have.length', versionList.length)
    cy.get('select').should('exist')
    cy.get('textarea').should('exist')
  })

  it('does not render versionList if it only contains one published element', () => {
    const handleClose = cy.stub()
    repository.deaccession = cy.stub().resolves()

    const singleVersionList: DatasetVersionSummaryInfo[] = [
      {
        id: 1,
        versionNumber: '1.0',
        publishedOn: '2021-01-01',
        contributors: 'Contributors'
      },
      {
        id: 2,
        versionNumber: 'draft',
        publishedOn: undefined,
        contributors: 'Contributors'
      }
    ]

    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={singleVersionList}
        handleClose={handleClose}
      />
    )

    cy.get('input[type="checkbox"]').should('not.exist')
    cy.get('select').select('IRB request.')
    cy.get('textarea').type('Additional information')
    cy.findByTestId('deaccession-forward-url').type('https://example.com')
    cy.get('button[type="submit"]').click()

    cy.wrap(repository.deaccession).should('be.calledWithMatch', persistentId, '1.0', {
      deaccessionReason: 'IRB request. Additional information',
      deaccessionForwardUrl: 'https://example.com'
    })
  })

  it('does only renders version if it is published', () => {
    const handleClose = cy.stub()

    const singleVersionList: DatasetVersionSummaryInfo[] = [
      {
        id: 1,
        versionNumber: '1.0',
        publishedOn: '2021-01-01',
        contributors: 'Contributors'
      },
      {
        id: 2,
        versionNumber: '2.0',
        publishedOn: '2021-01-02',
        contributors: 'Contributors'
      },
      {
        id: 3,
        versionNumber: 'draft',
        publishedOn: undefined,
        contributors: 'Contributors'
      }
    ]

    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={singleVersionList}
        handleClose={handleClose}
      />
    )

    cy.findByText('2.0 - 2021-01-02').should('exist')
    cy.findByText('draft -').should('not.exist')
  })

  it('submits the form', () => {
    const handleClose = cy.stub()
    repository.deaccession = cy.stub().resolves()

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
    cy.get('select').select('IRB request.')
    cy.get('textarea').type('Additional information')
    cy.findByTestId('deaccession-forward-url').type('https://example.com')
    cy.get('button[type="submit"]').click()

    cy.wrap(repository.deaccession).should('be.calledWithMatch', persistentId, '1.0', {
      deaccessionReason: 'IRB request. Additional information',
      deaccessionForwardUrl: 'https://example.com'
    })
  })
  it('displays validation error messages', () => {
    const handleClose = cy.stub()

    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={versionList}
        handleClose={handleClose}
      />
    )
    cy.findByTestId('deaccession-forward-url').type('bad-url')

    // Attempt to submit the form without filling required fields
    cy.get('button[type="submit"]').click()

    // Check for validation error messages
    cy.get('div').contains('Please select at least one version to deaccession.').should('exist')
    cy.get('div')
      .contains('Please select a reason for deaccessioning this dataset.')
      .should('exist')
    cy.get('div').contains('Please enter a valid URL').should('exist')
  })
  it('calls repository.deaccession once for every version selected', () => {
    const handleClose = cy.stub()
    repository.deaccession = cy.stub().resolves()

    cy.customMount(
      <DeaccessionDatasetModal
        show={true}
        repository={repository}
        persistentId={persistentId}
        versionList={versionList}
        handleClose={handleClose}
      />
    )

    // Select all versions
    cy.get('input[type="checkbox"]').each((checkbox) => {
      cy.wrap(checkbox).check()
    })
    cy.get('select').select('IRB request.')
    cy.get('textarea').type('Additional information')
    cy.findByTestId('deaccession-forward-url').type('https://example.com')
    cy.get('button[type="submit"]').click()

    // Check that repository.deaccession is called once for each selected version
    cy.wrap(repository.deaccession).should('have.callCount', versionList.length)
  })
  it('displays deaccession error message', () => {
    const handleClose = cy.stub()
    repository.deaccession = cy.stub().rejects(new Error('Deaccession failed'))
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
    cy.get('select').select('IRB request.')
    cy.get('button[type="submit"]').click()
    cy.get('div').contains('Deaccession failed').should('exist')
  })
})

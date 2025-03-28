import { DraftAlert } from '@/sections/file/draft-alert/DraftAlert'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'

describe('FileAccessRestrictedIcon', () => {
  it('should render the draft alert if dataset version is draft', () => {
    const datasetPersistentId = 'doi:test'
    cy.customMount(
      <DraftAlert
        datasetPersistentId={datasetPersistentId}
        datasetVersion={DatasetVersionMother.createDraft()}
      />
    )

    cy.findByText(/This draft version needs to be published/)
    // Find link to page
    cy.findByRole('link')
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${datasetPersistentId}&version=DRAFT`)
  })

  it('should not render the draft alert if dataset version is not draft', () => {
    const datasetPersistentId = 'doi:test'
    cy.customMount(
      <DraftAlert
        datasetPersistentId={datasetPersistentId}
        datasetVersion={DatasetVersionMother.create()}
      />
    )

    cy.findByText(/This draft version needs to be published/).should('not.exist')
  })
})

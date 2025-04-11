import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { FileHelper } from '../../../shared/files/FileHelper'

describe('EditFileMetadata', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })
  describe('Visit the Edit File Metadata Page as a logged in user', () => {
    it.only('successfully loads the edit file metadata page and submits form', () => {
      cy.wrap(
        DatasetHelper.createWithFile(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        )
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`/spa/files?id=${id}`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')

          cy.findByText('Metadata').should('exist')

          cy.findByRole('button', { name: 'Edit File' }).should('exist').click({ force: true })
          cy.findByRole('link', { name: 'Metadata' }).should('exist').click({ force: true })
          cy.findByRole('heading', { name: 'Edit File Metadata' }).should('exist')
          cy.findByTestId('edit-file-metadata-form').should('exist')
          cy.findByRole('button', { name: 'Save Changes' }).should('exist')
          cy.findByLabelText(/^File Name/i)
            .should('exist')
            .clear({ force: true })
            .type('new-file-name.txt', { force: true })
        })
      cy.findByLabelText(/^File Path/i)
        .should('exist')
        .clear({ force: true })
        .type('test/path', { force: true })

      cy.findByLabelText(/^Description/i)
        .should('exist')
        .clear({ force: true })
        .type('this is a new description', { force: true })

      cy.findByRole('button', { name: 'Save Changes' }).should('exist').click({ force: true })
      cy.findByText('File metadata updated successfully').should('exist')
      cy.findByRole('heading', { name: 'new-file-name.txt' }).should('exist')
      cy.findByText('this is a new description').should('exist')
      cy.findByText('test/path').should('exist')
    })

    it('loads page not found when passing a wrong id', () => {
      cy.visit(`/spa/files/edit-metadata?id=wrong-id`)
      cy.findByTestId('not-found-page').should('exist')
    })
  })
})

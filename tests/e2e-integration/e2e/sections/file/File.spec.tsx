import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'
import { FileHelper } from '../../../shared/files/FileHelper'

describe('File', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  describe('Visit the File Page as a logged in user', () => {
    it('successfully loads a file in draft mode', () => {
      cy.wrap(
        DatasetHelper.createWithFile(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        )
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`/spa/files?id=${id}`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')
          cy.findByText(DatasetLabelValue.DRAFT).should('exist')
          cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
          cy.findByRole('tab', { name: 'Versions' }).should('exist')
          cy.findByText('Metadata').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist')
        })
    })

    it('successfully loads a published file when the user is not authenticated', () => {
      cy.wrap(
        DatasetHelper.createWithFileAndPublish(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        ),
        { timeout: 6000 }
      )
        .its('id')
        .then((id: string) => {
          TestsUtils.logout()
          cy.visit(`/spa/files?id=${id}`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')

          cy.findByText('Version 1.0').should('exist')
          cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
          cy.findByText(DatasetLabelValue.UNPUBLISHED).should('not.exist')

          cy.findByText('Metadata').should('exist')
          cy.findByText('Versions').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist')
        })
    })

    it('loads new file page when clicking on the version number', () => {
      cy.wrap(
        DatasetHelper.createWithFileAndPublish(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        ),
        { timeout: 6000 }
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`/spa/files?id=${id}`)

          cy.findByRole('tab', { name: /versions/i })
            .should('exist')
            .click({ force: true })
        })

      cy.wait(1000)
      cy.findByText('1.0').should('exist').click({ force: true })
      cy.url().should('include', 'datasetVersion=1.0')
      cy.findByText('Version 1.0').should('exist')
    })

    it('loads page not found when the user is not authenticated and tries to access a draft', () => {
      cy.wrap(
        DatasetHelper.createWithFile(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        )
      )
        .its('id')
        .then((id: string) => {
          TestsUtils.logout()
          cy.visit(`/spa/files?id=${id}`)

          cy.findByTestId('not-found-page').should('exist')
        })
    })

    it('successfully loads a file when passing the id and datasetVersion', () => {
      cy.wrap(
        DatasetHelper.createWithFileAndPublish(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        ),
        { timeout: 6000 }
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`/spa/files?id=${id}&datasetVersion=1.0`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')

          cy.findByText('Version 1.0').should('exist')
        })
    })

    it('loads page not found when passing a wrong id', () => {
      cy.visit(`/spa/files?id=wrong-id`)
      cy.findByTestId('not-found-page').should('exist')
    })

    it('loads correctly the breadcrumbs', () => {
      cy.wrap(
        DatasetHelper.createWithFile(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        )
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`/spa/files?id=${id}`)

          cy.findByText('Root').should('exist')
          cy.findByRole('link', { name: "Darwin's Finches" }).should('exist').click({ force: true })

          cy.findByRole('heading', { name: "Darwin's Finches" }).should('exist')
        })
    })
  })
})

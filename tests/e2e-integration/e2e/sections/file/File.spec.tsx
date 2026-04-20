import { FRONTEND_BASE_PATH } from '@tests/e2e-integration/shared/basePath'
import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'
import { FileHelper } from '../../../shared/files/FileHelper'
import { GuestbookHelper } from '../../../shared/guestbooks/GuestbookHelper'
import { faker } from '@faker-js/faker'

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
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${id}`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')
          cy.findByText(DatasetLabelValue.DRAFT).should('exist')
          cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
          cy.findByRole('tab', { name: 'Versions' }).should('exist')
          cy.findByText('Metadata').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist')
        })
    })

    it('successfully loads a published file when the user is not authenticated', () => {
      cy.wrap(DatasetHelper.createWithFileAndPublish(FileHelper.create()), { timeout: 6000 }).then(
        (datasetResponse) => {
          if (!datasetResponse.file) {
            throw new Error('Expected created dataset to include a file')
          }

          const fileId = datasetResponse.file.id

          TestsUtils.logout()
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${fileId}`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')

          cy.findByText('Version 1.0').should('exist')
          cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
          cy.findByText(DatasetLabelValue.UNPUBLISHED).should('not.exist')

          cy.findByText('Metadata').should('exist')
          cy.findByText('Versions').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist')
        }
      )
    })

    it('loads version summaries when clicking on the version tab', () => {
      cy.wrap(
        DatasetHelper.createWithFileAndPublish(FileHelper.create()).then(
          (datasetResponse) => datasetResponse.file
        ),
        { timeout: 6000 }
      )
        .its('id')
        .then((id: string) => {
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${id}`)
          cy.wait(3000)

          cy.findByRole('tab', { name: 'Versions' }).should('exist').click({ force: true })

          cy.findByText('1.0').should('exist')
        })
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
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${id}`)
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
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${id}&datasetVersion=1.0`)

          cy.findByRole('heading', { name: 'blob' }).should('exist')

          cy.findByText('Version 1.0').should('exist')
        })
    })

    it('loads page not found when passing a wrong id', () => {
      cy.visit(`${FRONTEND_BASE_PATH}/files?id=wrong-id`)
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
          cy.visit(`${FRONTEND_BASE_PATH}/files?id=${id}`)
          cy.findByText('Root').should('exist')
          cy.findByRole('link', { name: "Darwin's Finches" }).should('exist').click({ force: true })

          cy.findByRole('heading', { name: "Darwin's Finches" }).should('exist')
        })
    })

    it('downloads a file from the file page directly for dataset editors even when a guestbook is assigned', () => {
      const guestbookName = `Guestbook ${faker.datatype.uuid()}`

      cy.wrap(DatasetHelper.createWithFile(FileHelper.create())).then((dataset) => {
        if (!dataset.file) {
          throw new Error('Expected created dataset to include a file')
        }
        const file = dataset.file

        return cy
          .wrap(
            GuestbookHelper.createAndGetByName(guestbookName).then(async (guestbook) => {
              await GuestbookHelper.assignToDataset(Number(dataset.id), guestbook.id)
              await DatasetHelper.publish(dataset.persistentId)

              return file
            })
          )
          .then((file) => {
            cy.visit(`${FRONTEND_BASE_PATH}/files?id=${file.id}`)
            cy.wait(1500)

            cy.window().then((window) => {
              cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
            })

            cy.findByRole('button', { name: 'Access File' }).as('accessButton')
            cy.get('@accessButton').should('be.visible')
            cy.wait(500) // wait for the event handler to attach to the button
            cy.get('@accessButton').click()
            cy.findByTestId('download-original-file').should('exist').click({ force: true })

            cy.get('@anchorClick').should('have.been.calledOnce')
            cy.findByRole('dialog').should('not.exist')
            cy.findByText('Your download has started.').should('exist')
          })
      })
    })

    it('opens the guestbook modal for guests on the file page when a guestbook is assigned', () => {
      const guestbookName = `Guestbook ${faker.datatype.uuid()}`

      cy.wrap(DatasetHelper.createWithFile(FileHelper.create())).then((dataset) => {
        if (!dataset.file) {
          throw new Error('Expected created dataset to include a file')
        }
        const file = dataset.file

        return cy
          .wrap(
            GuestbookHelper.createAndGetByName(guestbookName).then(async (guestbook) => {
              await GuestbookHelper.assignToDataset(Number(dataset.id), guestbook.id)
              await DatasetHelper.publish(dataset.persistentId)

              return file
            })
          )
          .then((file) => {
            TestsUtils.logout()
            cy.visit(`${FRONTEND_BASE_PATH}/files?id=${file.id}`)
            cy.wait(1500)

            cy.findByRole('button', { name: 'Access File' }).as('accessButton')
            cy.get('@accessButton').should('be.visible')
            cy.wait(500)
            cy.get('@accessButton').click()
            cy.findByTestId('download-original-file').should('exist').click({ force: true })

            cy.findByRole('dialog').should('be.visible')
            cy.findByLabelText(/name/i).should('be.enabled')
            cy.findByLabelText(/email/i).should('be.enabled')
          })
      })
    })
  })
})

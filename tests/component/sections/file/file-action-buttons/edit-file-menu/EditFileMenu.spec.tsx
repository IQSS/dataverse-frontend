import { EditFileMenu } from '@/sections/file/file-action-buttons/edit-file-menu/EditFileMenu'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileMother } from '@tests/component/files/domain/models/FileMother'

const testFile = FileMother.createRealistic()

describe('EditFileMenu', () => {
  it('renders the edit file menu', () => {
    cy.customMount(
      <EditFileMenu
        fileId={testFile.id}
        fileRepository={new FileMockRepository()}
        datasetInfo={{
          persistentId: testFile.datasetPersistentId,
          versionNumber: testFile.datasetVersion.number.toSearchParam(),
          releasedVersionExists: false
        }}
      />
    )

    cy.findByRole('button', { name: 'Edit File' }).should('exist').click()
    cy.findByRole('button', { name: 'Replace' }).should('exist')
    cy.findByRole('button', { name: 'Delete' }).should('exist')
  })

  it('clicks the replace button', () => {
    cy.customMount(
      <EditFileMenu
        fileId={testFile.id}
        fileRepository={new FileMockRepository()}
        datasetInfo={{
          persistentId: testFile.datasetPersistentId,
          versionNumber: testFile.datasetVersion.number.toSearchParam(),
          releasedVersionExists: false
        }}
      />
    )

    cy.findByRole('button', { name: 'Edit File' }).click()
    cy.findByRole('button', { name: 'Replace' }).click()
  })

  describe('Delete button', () => {
    it('opens and close the delete file confirmation modal', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            versionNumber: testFile.datasetVersion.number.toSearchParam(),
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Delete' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('file dataset has a released version, shows custom message also', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            versionNumber: testFile.datasetVersion.number.toSearchParam(),
            releasedVersionExists: true
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Delete' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByText(/Files will not be removed from previously published versions of the dataset./)
        .should('exist')
        .should('be.visible')
    })

    it('closes the modal and shows toast success message when delete file succeeds', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            versionNumber: testFile.datasetVersion.number.toSearchParam(),
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Delete' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      // The loading spinner inside delete button
      cy.findByRole('status').should('exist')

      cy.findByRole('dialog').should('not.exist')
      cy.findByText(/The file has been deleted./)
        .should('exist')
        .should('be.visible')
    })

    it('shows the js-dataverse WriteError message if delete collection fails with a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.delete = cy.stub().rejects(new WriteError('Testing delete error message.'))

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            versionNumber: testFile.datasetVersion.number.toSearchParam(),
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Delete' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      cy.findByText('Testing delete error message.').should('exist')
    })

    it('shows the default error message if delete collection fails with not a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.delete = cy.stub().rejects('Some error')

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            versionNumber: testFile.datasetVersion.number.toSearchParam(),
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Delete' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      cy.findByText('Something went wrong deleting the file. Try again later.').should('exist')
    })
  })
})

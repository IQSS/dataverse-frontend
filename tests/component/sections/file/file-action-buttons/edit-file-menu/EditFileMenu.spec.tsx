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
        isRestricted={false}
        datasetInfo={{
          persistentId: testFile.datasetPersistentId,
          releasedVersionExists: false,
          termsOfAccessForRestrictedFiles: 'terms of access for restricted files'
        }}
      />
    )

    cy.findByRole('button', { name: 'Edit File' }).should('exist')
  })

  describe('Delete button', () => {
    it('opens and close the delete file confirmation modal', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
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
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
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
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
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
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
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
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
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

  describe('Restrict button', () => {
    it('opens and close the restrict file modal', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')
      cy.findByRole('checkbox').should('exist')
      cy.findAllByText(/terms of access for restricted files/i).should('exist')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('should show terms Of Access For Restricted Files in restrict file modal', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false,
            termsOfAccessForRestrictedFiles: 'test terms of access'
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')
      cy.findByRole('checkbox').should('exist')
      cy.findAllByText(/terms of access for restricted files/i).should('exist')
      cy.findByText(/test terms of access/i).should('exist')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('file dataset has a released version, shows custom message also', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: true
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByText(
        /Files will not be changed from previously published versions of the dataset./
      ).should('exist')
    })

    it.skip('should disable Save button if no terms of acccess and disenable access request', () => {
      //skipped because the access request and terms of access are not editable yet
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')
      cy.findByRole('checkbox').uncheck()
      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('closes the modal and shows toast success message when restrict file succeeds', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByRole('status').should('exist')

      cy.findByRole('dialog').should('not.exist')
      cy.findByText(/The file has been restricted./)
        .should('exist')
        .should('be.visible')
    })

    it('shows the default error message if restrict file fails with not a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.restrict = cy.stub().rejects('Some error')

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByText('Something went wrong restricting the file. Try again later.').should('exist')
    })

    it('shows the js-dataverse WriteError message if restrict fails with a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.restrict = cy.stub().rejects(new WriteError('error message.'))

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          isRestricted={false}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Restrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByText('error message.').should('exist')
    })
  })

  describe('Unrestrict button', () => {
    it('opens and close the unrestrict file modal', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={true}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Unrestrict' }).click()
      cy.findByRole('dialog').should('exist')
      cy.findByText(/The file will be unrestricted./i).should('exist')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('file dataset has a released version, shows custom message also', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={true}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: true
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Unrestrict' }).click()
      cy.findByRole('dialog').should('exist')
      cy.findByText(
        /Files will not be changed from previously published versions of the dataset./
      ).should('exist')
    })

    it('closes the modal and shows toast success message when unrestrict file succeeds', () => {
      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={new FileMockRepository()}
          isRestricted={true}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Unrestrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByRole('status').should('exist')

      cy.findByRole('dialog').should('not.exist')
      cy.findByText(/The file has been unrestricted./)
        .should('exist')
        .should('be.visible')
    })

    it('shows the default error message if unrestrict file fails with not a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.restrict = cy.stub().rejects('Some error')

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          isRestricted={true}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Unrestrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByText('Something went wrong unrestricting the file. Try again later.').should('exist')
    })

    it('shows the js-dataverse WriteError message if unrestrict fails with a js-dataverse WriteError', () => {
      const fileRepository = new FileMockRepository()
      fileRepository.restrict = cy.stub().rejects(new WriteError('error message.'))

      cy.customMount(
        <EditFileMenu
          fileId={testFile.id}
          fileRepository={fileRepository}
          isRestricted={true}
          datasetInfo={{
            persistentId: testFile.datasetPersistentId,
            releasedVersionExists: false
          }}
        />
      )

      cy.findByRole('button', { name: 'Edit File' }).click()
      cy.findByRole('button', { name: 'Unrestrict' }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Save Changes/i }).click()

      cy.findByText('error message.').should('exist')
    })
  })
})

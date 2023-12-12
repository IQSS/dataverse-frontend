import { AccessFileMenu } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { Suspense } from 'react'
import { FilePermissionsProvider } from '../../../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../../files/domain/models/FileUserPermissionsMother'

const file = FileMother.create()

const fileRepository = {} as FileRepository
describe('AccessFileMenu', () => {
  beforeEach(() => {
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        canDownloadFile: true
      })
    )
  })
  it('renders the access file menu', () => {
    cy.customMount(<AccessFileMenu file={file} />)

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the access file menu with tooltip', () => {
    cy.customMount(<AccessFileMenu file={file} />)

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('exist')
  })

  it('renders the menu headers', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu file={file} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist').click()
    cy.findByRole('heading', { name: 'File Access' }).should('exist')
  })

  it('renders the access status of the file', () => {
    const filePublic = FileMother.createWithPublicAccess()
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu file={filePublic} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Public').should('exist')
  })

  it('renders the request access button', () => {
    const fileRestrictedWithAccessRequestAllowed = FileMother.createWithAccessRequestAllowed()
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu file={fileRestrictedWithAccessRequestAllowed} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the download options header', () => {
    const filePublic = FileMother.createWithPublicAccess()
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessFileMenu file={filePublic} />
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })
})

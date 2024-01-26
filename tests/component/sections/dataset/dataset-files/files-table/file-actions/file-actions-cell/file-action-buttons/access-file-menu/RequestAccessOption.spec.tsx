import { RequestAccessOption } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/RequestAccessOption'
import {
  FileEmbargoMother,
  FilePreviewMother
} from '../../../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '../../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../../files/domain/models/FileUserPermissionsMother'

describe('RequestAccessOption', () => {
  it('renders the embargoed message when the file is embargoed', () => {
    const fileEmbargoed = FilePreviewMother.createDefault({
      embargo: FileEmbargoMother.create(),
      permissions: { canDownloadFile: false }
    })
    cy.customMount(<RequestAccessOption file={fileEmbargoed} />)

    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the embargo then restricted message when the file is embargoed and restricted', () => {
    const fileEmbargoedRestricted = FilePreviewMother.createWithEmbargoRestricted()
    cy.customMount(<RequestAccessOption file={fileEmbargoedRestricted} />)

    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the Users may not request access to files. message when the file is restricted and access request is not allowed', () => {
    const fileRestricted = FilePreviewMother.createWithRestrictedAccess()
    cy.customMount(<RequestAccessOption file={fileRestricted} />)

    cy.findByRole('button', { name: 'Users may not request access to files.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the request access button when the file is restricted and can be requested', () => {
    const fileRestrictedCanBeRequested = FilePreviewMother.createWithAccessRequestAllowed()
    cy.customMount(<RequestAccessOption file={fileRestrictedCanBeRequested} />)

    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the access requested message when hen the file is restricted and the access has already been requested', () => {
    const fileAlreadyRequested = FilePreviewMother.createWithAccessRequestPending()

    cy.customMount(<RequestAccessOption file={fileAlreadyRequested} />)

    cy.findByRole('button', { name: 'Access Requested' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('does not render the request access button when the file is deaccessioned', () => {
    const fileDeaccessioned = FilePreviewMother.createDeaccessioned()
    cy.customMount(<RequestAccessOption file={fileDeaccessioned} />)

    cy.findByRole('button', { name: 'Users may not request access to files.' }).should('not.exist')
    cy.findByRole('button', { name: 'Request Access' }).should('not.exist')
    cy.findByRole('button', { name: 'Access Requested' }).should('not.exist')
    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' }).should(
      'not.exist'
    )
    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    }).should('not.exist')
  })

  it('does not render the request access button when the file status is public', () => {
    const filePublic = FilePreviewMother.createWithPublicAccess()

    cy.customMount(<RequestAccessOption file={filePublic} />)

    cy.findByRole('button', { name: 'Users may not request access to files.' }).should('not.exist')
    cy.findByRole('button', { name: 'Request Access' }).should('not.exist')
    cy.findByRole('button', { name: 'Access Requested' }).should('not.exist')
    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' }).should(
      'not.exist'
    )
    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    }).should('not.exist')
  })

  it('does not render the request access button when the file status is restricted with access granted', () => {
    const fileRestrictedWithAccess = FilePreviewMother.createWithRestrictedAccessWithAccessGranted()

    cy.customMount(<RequestAccessOption file={fileRestrictedWithAccess} />)

    cy.findByRole('button', { name: 'Users may not request access to files.' }).should('not.exist')
    cy.findByRole('button', { name: 'Request Access' }).should('not.exist')
    cy.findByRole('button', { name: 'Access Requested' }).should('not.exist')
    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' }).should(
      'not.exist'
    )
    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    }).should('not.exist')
  })
})

import { RequestAccessOption } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/RequestAccessOption'
import {
  FileAccessStatus,
  FileStatus
} from '../../../../../../../../../../src/files/domain/models/File'

const accessCannotBeRequested = {
  restricted: true,
  canBeRequested: false,
  requested: false
}
const accessCanBeRequested = {
  restricted: true,
  canBeRequested: true,
  requested: false
}
const fileId = 'file-id'
describe('RequestAccessOption', () => {
  it('renders the embargoed message when the file is embargoed', () => {
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        accessStatus={FileAccessStatus.EMBARGOED}
        access={accessCannotBeRequested}
      />
    )

    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the embargo then restricted message when the file is embargoed and restricted', () => {
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        accessStatus={FileAccessStatus.EMBARGOED_RESTRICTED}
        access={accessCanBeRequested}
      />
    )

    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the Users may not request access to files. message when the file is restricted and access request is not allowed', () => {
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        accessStatus={FileAccessStatus.RESTRICTED}
        access={accessCannotBeRequested}
      />
    )

    cy.findByRole('button', { name: 'Users may not request access to files.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the request access button when the file is restricted and can be requested', () => {
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        accessStatus={FileAccessStatus.RESTRICTED}
        access={accessCanBeRequested}
      />
    )

    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the access requested message when hen the file is restricted and the access has already been requested', () => {
    const accessRequested = {
      ...accessCanBeRequested,
      requested: true
    }

    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        accessStatus={FileAccessStatus.RESTRICTED}
        access={accessRequested}
      />
    )

    cy.findByRole('button', { name: 'Access Requested' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('does not render the request access button when the file is deaccessioned', () => {
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.DEACCESSIONED}
        access={accessCanBeRequested}
        accessStatus={FileAccessStatus.RESTRICTED}
      />
    )

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
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        access={accessCanBeRequested}
        accessStatus={FileAccessStatus.PUBLIC}
      />
    )

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
    cy.customMount(
      <RequestAccessOption
        fileId={fileId}
        versionStatus={FileStatus.RELEASED}
        access={accessCanBeRequested}
        accessStatus={FileAccessStatus.RESTRICTED_WITH_ACCESS}
      />
    )

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

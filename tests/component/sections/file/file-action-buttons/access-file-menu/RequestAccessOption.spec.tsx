import { RequestAccessOption } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/RequestAccessOption'
import { FileAccessMother } from '../../../../files/domain/models/FileAccessMother'

const access = FileAccessMother.create()
describe('RequestAccessOption', () => {
  it('renders the embargoed message when the file is embargoed', () => {
    const accessPublic = FileAccessMother.createPublic()
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={accessPublic}
        isActivelyEmbargoed
        isDeaccessioned={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('button', { name: 'Files are unavailable during the specified embargo.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the embargo then restricted message when the file is embargoed and restricted', () => {
    const accessRestricted = FileAccessMother.createRestricted()
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={accessRestricted}
        isActivelyEmbargoed
        isDeaccessioned={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('button', {
      name: 'Files are unavailable during the specified embargo and restricted after that.'
    })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the Users may not request access to files. message when the file is restricted and access request is not allowed', () => {
    const accessRequestNotAllowed = FileAccessMother.createWithAccessRequestNotAllowed()
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={accessRequestNotAllowed}
        isActivelyEmbargoed={false}
        isDeaccessioned={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('button', { name: 'Users may not request access to files.' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('renders the request access button when the file is restricted and can be requested', () => {
    const accessRequestAllowed = FileAccessMother.createWithAccessRequestAllowed()
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={accessRequestAllowed}
        isActivelyEmbargoed={false}
        isDeaccessioned={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the access requested message when hen the file is restricted and the access has already been requested', () => {
    const accessRequestPending = FileAccessMother.createWithAccessRequestPending()

    cy.customMount(
      <RequestAccessOption
        id={1}
        access={accessRequestPending}
        isActivelyEmbargoed={false}
        isDeaccessioned={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('button', { name: 'Access Requested' })
      .should('exist')
      .should('have.class', 'disabled')
  })

  it('does not render the request access button when the file is deaccessioned', () => {
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={access}
        isActivelyEmbargoed={false}
        isDeaccessioned
        userHasDownloadPermission={false}
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

  it('does not render the request access button when the user has download permission', () => {
    cy.customMount(
      <RequestAccessOption
        id={1}
        access={access}
        isActivelyEmbargoed={false}
        isDeaccessioned={false}
        userHasDownloadPermission
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

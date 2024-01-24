import { AccessFileMenu } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileAccessMother } from '../../../../files/domain/models/FileAccessMother'
import { FileMetadataMother } from '../../../../files/domain/models/FileMetadataMother'
import { Suspense } from 'react'

describe('AccessFileMenu', () => {
  it('renders the access file menu', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the access file menu with tooltip when asIcon is true', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon
      />
    )

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('exist')
  })

  it('does not render the access file menu with tooltip when asIcon is false', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('not.exist')
  })

  it('renders the menu headers', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu
          id={1}
          access={FileAccessMother.create()}
          metadata={FileMetadataMother.create()}
          userHasDownloadPermission
          ingestInProgress={false}
          isDeaccessioned={false}
        />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist').click()
    cy.findByRole('heading', { name: 'File Access' }).should('exist')
  })

  it('renders the access status of the file', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.createNotEmbargoed()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Public').should('exist')
  })

  it('renders the request access button', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createWithAccessRequestAllowed()}
        metadata={FileMetadataMother.createNotEmbargoed()}
        userHasDownloadPermission={false}
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the download options header', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('renders the button as an icon when asIcon is true', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.get('svg').should('exist')
  })
})

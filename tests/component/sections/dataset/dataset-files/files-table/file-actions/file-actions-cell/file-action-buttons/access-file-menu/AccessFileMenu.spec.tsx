import { AccessFileMenu } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'
import { Suspense } from 'react'

const file = FilePreviewMother.create({ permissions: { canDownloadFile: true } })

describe('AccessFileMenu', () => {
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
    const filePublic = FilePreviewMother.createWithPublicAccess()
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu file={filePublic} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Public').should('exist')
  })

  it.only('renders the request access button', () => {
    const fileRestrictedWithAccessRequestAllowed =
      FilePreviewMother.createWithAccessRequestAllowed()
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu file={fileRestrictedWithAccessRequestAllowed} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the download options header', () => {
    const filePublic = FilePreviewMother.createWithPublicAccess()
    cy.customMount(<AccessFileMenu file={filePublic} />)

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })
})

import { AccessFileButton } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-button/AccessFileButton'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { Suspense } from 'react'

const file = FileMother.create()
describe('AccessFileButton', () => {
  it('renders the file action button access file', () => {
    cy.customMount(<AccessFileButton file={file} />)

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the file action button access file with tooltip', () => {
    cy.customMount(<AccessFileButton file={file} />)

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('exist')
  })

  it('renders the dropdown headers', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileButton file={file} />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist').click()
    cy.findByRole('heading', { name: 'File Access' }).should('exist')
  })

  it('renders the access status of the file', () => {
    const filePublic = FileMother.create({
      access: {
        restricted: false,
        canDownload: true
      },
      embargo: undefined
    })
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileButton file={filePublic} />{' '}
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Public').should('exist')
  })
})

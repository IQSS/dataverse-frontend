import { EditFilesOptions } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesOptions'
import { FileMother } from '../../../../../../files/domain/models/FileMother'

const files = FileMother.createMany(2)
describe('EditFilesOptions', () => {
  it('renders the EditFilesOptions', () => {
    cy.customMount(<EditFilesOptions files={files} />)

    cy.findByRole('button', { name: 'Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Replace' }).should('exist')
    cy.findByRole('button', { name: 'Embargo' }).should('not.exist')
    cy.findByRole('button', { name: 'Provenance' }).should('not.exist')
    cy.findByRole('button', { name: 'Delete' }).should('exist')
  })

  it('renders the restrict option if some file is unrestricted', () => {
    const fileUnrestricted = FileMother.createDefault()
    cy.customMount(<EditFilesOptions files={[fileUnrestricted]} />)

    cy.findByRole('button', { name: 'Restrict' }).should('exist')
  })

  it('renders the unrestrict option if some file is restricted', () => {
    const fileRestricted = FileMother.createWithRestrictedAccess()
    cy.customMount(<EditFilesOptions files={[fileRestricted]} />)

    cy.findByRole('button', { name: 'Unrestrict' }).should('exist')
  })

  it.skip('renders the embargo option if the embargo is allowed by settings', () => {
    cy.customMount(<EditFilesOptions files={files} />)

    cy.findByRole('button', { name: 'Embargo' }).should('exist')
  })

  it.skip('renders provenance option if provenance is enabled in config', () => {
    cy.customMount(<EditFilesOptions files={files} />)

    cy.findByRole('button', { name: 'Provenance' }).should('exist')
  })
})

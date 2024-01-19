import { EditFilesOptions } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesOptions'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'

const files = FilePreviewMother.createMany(2)
describe('EditFilesOptions', () => {
  it('renders the EditFilesOptions', () => {
    cy.customMount(<EditFilesOptions files={files} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Replace' }).should('exist')
    cy.findByRole('button', { name: 'Embargo' }).should('not.exist')
    cy.findByRole('button', { name: 'Provenance' }).should('not.exist')
    cy.findByRole('button', { name: 'Delete' }).should('exist')
  })

  it('renders the restrict option if some file is unrestricted', () => {
    const fileUnrestricted = FilePreviewMother.createDefault()
    cy.customMount(<EditFilesOptions files={[fileUnrestricted]} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Restrict' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it('renders the unrestrict option if some file is restricted', () => {
    const fileRestricted = FilePreviewMother.createWithRestrictedAccess()
    cy.customMount(<EditFilesOptions files={[fileRestricted]} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Unrestrict' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it.skip('renders the embargo option if the embargo is allowed by settings', () => {
    cy.customMount(<EditFilesOptions files={files} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Embargo' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it.skip('renders provenance option if provenance is enabled in config', () => {
    cy.customMount(<EditFilesOptions files={files} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Provenance' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it('shows the No Selected Files message when no files are selected and one option is clicked', () => {
    cy.customMount(<EditFilesOptions files={files} fileSelection={{}} />)

    cy.findByRole('button', { name: 'Metadata' }).click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()

    cy.findByRole('button', { name: 'Replace' }).click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()

    cy.findByRole('button', { name: 'Delete' }).click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it('does not show the No Selected Files message when files are selected and one option is clicked', () => {
    cy.customMount(
      <EditFilesOptions
        files={files}
        fileSelection={{ 'some-file-id': FilePreviewMother.create() }}
      />
    )

    cy.findByRole('button', { name: 'Metadata' }).click()
    cy.findByText('Select File(s)').should('not.exist')

    cy.findByRole('button', { name: 'Replace' }).click()
    cy.findByText('Select File(s)').should('not.exist')

    cy.findByRole('button', { name: 'Delete' }).click()
    cy.findByText('Select File(s)').should('not.exist')
  })
})

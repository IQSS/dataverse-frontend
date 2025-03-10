import { EditFilesOptions } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesOptions'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const files = FilePreviewMother.createMany(2)
const fileRepository: FileRepository = {} as FileRepository

const datasetInfo = {
  persistentId: `doi:10.5072/FK2/0000}`,
  releasedVersionExists: false,
  termsOfAccessForRestrictedFiles: ''
}

describe('EditFilesOptions', () => {
  it('renders the EditFilesOptions', () => {
    cy.customMount(
      <EditFilesOptions
        files={files}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

    cy.findByRole('button', { name: 'Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Replace' }).should('exist')
    cy.findByRole('button', { name: 'Embargo' }).should('not.exist')
    cy.findByRole('button', { name: 'Provenance' }).should('not.exist')
    cy.findByRole('button', { name: 'Delete' }).should('exist')
  })

  it('renders the restrict option if some file is unrestricted', () => {
    const fileUnrestricted = FilePreviewMother.createDefault()
    cy.customMount(
      <EditFilesOptions
        files={[fileUnrestricted]}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

    cy.findByRole('button', { name: 'Restrict' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it('renders the unrestrict option if some file is restricted', () => {
    const fileRestricted = FilePreviewMother.createRestricted()
    cy.customMount(
      <EditFilesOptions
        files={[fileRestricted]}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

    cy.findByRole('button', { name: 'Unrestrict' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it.skip('renders the embargo option if the embargo is allowed by settings', () => {
    cy.customMount(
      <EditFilesOptions
        files={files}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

    cy.findByRole('button', { name: 'Embargo' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it.skip('renders provenance option if provenance is enabled in config', () => {
    cy.customMount(
      <EditFilesOptions
        files={files}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

    cy.findByRole('button', { name: 'Provenance' }).should('exist').click()
    cy.findByText('Select File(s)').should('exist')
    cy.findByText('Close').click()
  })

  it('shows the No Selected Files message when no files are selected and one option is clicked', () => {
    cy.customMount(
      <EditFilesOptions
        files={files}
        fileSelection={{}}
        fileRepository={fileRepository}
        isHeader={true}
      />
    )

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
        fileRepository={fileRepository}
        isHeader={true}
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

describe('EditFilesOptions for a single file', () => {
  it('renders the EditFilesOptions', () => {
    const fileUnrestricted = FilePreviewMother.createDefault()
    cy.customMount(
      <EditFilesOptions
        file={fileUnrestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
        isHeader={false}
      />
    )

    cy.findByRole('button', { name: 'Restrict' }).should('exist')
    cy.findByRole('button', { name: 'Delete' }).should('exist')
  })

  it('renders the restrict option if some file is unrestricted', () => {
    const fileUnrestricted = FilePreviewMother.createDefault()
    cy.customMount(
      <EditFilesOptions
        file={fileUnrestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
        isHeader={false}
      />
    )

    cy.findByRole('button', { name: 'Restrict' }).should('exist').click()
    cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    cy.findByText('Cancel').click()
  })

  it('renders the unrestrict option if file is restricted', () => {
    const fileRestricted = FilePreviewMother.createRestricted()
    cy.customMount(
      <EditFilesOptions
        file={fileRestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
        isHeader={false}
      />
    )

    cy.findByRole('button', { name: 'Unrestrict' }).should('exist').click()
    cy.findByText('The file will be unrestricted.').should('exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    cy.findByText('Cancel').click()
  })

  it('renders delete', () => {
    const fileUnrestricted = FilePreviewMother.createDefault()
    cy.customMount(
      <EditFilesOptions
        file={fileUnrestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
        isHeader={false}
      />
    )

    cy.findByRole('button', { name: 'Delete' }).should('exist').click()
    cy.findByText('The file will be deleted after you click on the Delete button.').should('exist')
    cy.findByText('Cancel').click()
  })
})

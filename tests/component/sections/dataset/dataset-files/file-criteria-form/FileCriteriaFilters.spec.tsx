import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FileCriteriaFilters } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaFilters'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'

const defaultCriteria = new FileCriteria()
const filesCountInfo = FilesCountInfoMother.create({
  perFileType: [
    {
      type: new FileType('image'),
      count: 5
    },
    {
      type: new FileType('text'),
      count: 10
    }
  ]
})

describe('FilesCriteriaFilters', () => {
  it('renders filters by type options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByText('Filter by').should('exist')

    cy.findByRole('button', { name: 'File Type: All' }).should('exist')
    cy.findByRole('button', { name: 'Access: All' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: All' }).should('exist')
  })

  it('does not render filters by type options when there are no filters to be applied', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const filesCountInfo = FilesCountInfoMother.createOnlyTotal()

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByText('Filter by').should('not.exist')

    cy.findByRole('button', { name: 'File Type: All' }).should('not.exist')
    cy.findByRole('button', { name: 'Access: All' }).should('not.exist')
    cy.findByRole('button', { name: 'File Tags: All' }).should('not.exist')
  })
})

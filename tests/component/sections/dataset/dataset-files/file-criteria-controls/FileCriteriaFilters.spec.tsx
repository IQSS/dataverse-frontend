import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FileCriteriaFilters } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaFilters'
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

    cy.findByRole('button', { name: 'Filter Type: All' }).should('exist')
  })
})

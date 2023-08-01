import { FileCriteria, FileTag } from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'
import styles from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaControls.module.scss'
import { FileCriteriaFilterByTag } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaFilterByTag'

const defaultCriteria = new FileCriteria()
const filesCountInfo = FilesCountInfoMother.create({
  perFileTag: [
    {
      tag: new FileTag('document'),
      count: 5
    },
    {
      tag: new FileType('data'),
      count: 10
    }
  ]
})

describe('FilesCriteriaFilterByTag', () => {
  it('renders filter by tag options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByTag
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).click()

    cy.findByText('All').should('exist')
    cy.findByText('Document (5)').should('exist')
    cy.findByText('Data (10)').should('exist')
  })

  it('calls onCriteriaChange with the selected filter by tag value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByTag
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).click()
    cy.findByText('Document (5)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByTag('document'))

    cy.findByRole('button', { name: 'Filter Tag: Document' }).click()
    cy.findByText('Data (10)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByTag('data'))
  })

  it('shows the selected filter in the dropdown title', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = defaultCriteria.withFilterByTag('document')

    cy.customMount(
      <FileCriteriaFilterByTag
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: Document' }).click()
    cy.findByText('All').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType(undefined))
  })

  it('changes the filter option text to bold when selected', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByTag
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).click()
    cy.findByText('All').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'Document (5)' }).click()
    cy.findByRole('button', { name: 'Filter Tag: Document' }).click()
    cy.findByText('Document (5)').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'Data (10)' }).click()
    cy.findByRole('button', { name: 'Filter Tag: Data' }).click()
    cy.findByText('Data (10)').should('have.class', styles['selected-option'])
  })

  it('does not show the filter by tag dropdown when there are no filter options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const filesCountInfo = FilesCountInfoMother.create({
      perFileTag: []
    })

    cy.customMount(
      <FileCriteriaFilterByTag
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).should('not.exist')
  })
})

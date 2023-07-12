import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FileCriteriaFilters } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaFilters'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'
import styles from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaInputs.module.scss'

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
  it('renders filter by type options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByText('Filter by').should('exist')

    cy.findByRole('button', { name: 'Filter Type: All' }).click()

    cy.findByText('All').should('exist')
    cy.findByText('Image (5)').should('exist')
    cy.findByText('Text (10)').should('exist')
  })

  it('calls onCriteriaChange with the selected filter by type value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).click()
    cy.findByText('Image (5)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType('image'))

    cy.findByRole('button', { name: 'Filter Type: All' }).click()
    cy.findByText('Text (10)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType('text'))
  })

  it('shows the selected filter in the dropdown title', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = defaultCriteria.withFilterByType('image')

    cy.customMount(
      <FileCriteriaFilters
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: Image' }).click()
    cy.findByText('All').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType(undefined))
  })

  it('changes the filter option text to bold when selected', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).click()
    cy.findByText('All').should('have.class', styles['selected-option'])

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria.withFilterByType('image')}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )
    cy.findByRole('button', { name: 'Filter Type: Image' }).click()
    cy.findByText('Image (5)').should('have.class', styles['selected-option'])

    cy.customMount(
      <FileCriteriaFilters
        criteria={defaultCriteria.withFilterByType('text')}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )
    cy.findByRole('button', { name: 'Filter Type: Text' }).click()
    cy.findByText('Text (10)').should('have.class', styles['selected-option'])
  })
})
